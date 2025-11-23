import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Type augmentation for Session
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string | null;
            major?: string | null;
            occupation?: string | null;
        };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    // @ts-ignore: Role exists in DB but client needs regeneration
                    role: user.role,
                    // @ts-ignore
                    major: user.major,
                    // @ts-ignore
                    occupation: user.occupation,
                };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
                // @ts-ignore
                token.major = user.major;
                // @ts-ignore
                token.occupation = user.occupation;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                // @ts-ignore
                session.user.role = token.role as string;
                // @ts-ignore
                session.user.major = token.major as string;
                // @ts-ignore
                session.user.occupation = token.occupation as string;

                // Update streak logic and fetch latest user data
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.sub as string },
                        select: {
                            streak: true,
                            lastLoginDate: true,
                            role: true,
                            occupation: true,
                            major: true
                        }
                    });

                    if (user) {
                        // Update session with latest data from DB
                        // @ts-ignore
                        session.user.role = user.role;
                        // @ts-ignore
                        session.user.occupation = user.occupation;
                        // @ts-ignore
                        session.user.major = user.major;

                        const now = new Date();
                        const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

                        // If no last login, or last login was not today
                        if (!lastLogin || lastLogin.toDateString() !== now.toDateString()) {
                            let newStreak = user.streak;

                            // Check if last login was yesterday to increment streak
                            if (lastLogin) {
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                if (lastLogin.toDateString() === yesterday.toDateString()) {
                                    newStreak++;
                                } else {
                                    // Reset streak if missed a day (unless it's the first login ever)
                                    newStreak = 1;
                                }
                            } else {
                                newStreak = 1;
                            }

                            await prisma.user.update({
                                where: { id: token.sub as string },
                                data: {
                                    lastLoginDate: now,
                                    streak: newStreak
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error updating streak:", error);
                }
            }
            return session;
        }
    }
};
