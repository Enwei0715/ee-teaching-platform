import type { Metadata } from "next";
import "./globals.css";
import 'katex/dist/katex.min.css';
import { Inter } from 'next/font/google';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import AITutor from "@/components/ai/AITutor";
import HotkeysProvider from "@/context/HotkeysProvider";
import ShortcutsModal from '@/components/layout/ShortcutsModal';
import { EditModeProvider } from "@/context/EditModeContext";
import BackgroundGrid from "@/components/layout/BackgroundGrid";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "EE Master | Electronic Engineering Platform",
    description: "The ultimate resource for learning Electronic Engineering, from circuits to FPGAs.",
    icons: {
        icon: '/icon_without_text.png',
        apple: '/icon_without_text.png',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch footer data server-side
    const settingsData = await prisma.siteSettings.findMany();
    const settings = settingsData.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    const links = await prisma.footerLink.findMany({ orderBy: { orderIndex: 'asc' } });

    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
                <AuthProvider>
                    <EditModeProvider>
                        <HotkeysProvider>
                            <div className="flex flex-col min-h-screen">
                                <Navbar />
                                <main className="flex-1 w-full relative">
                                    {/* Subtle Blueprint Grid Overlay */}
                                    <BackgroundGrid />
                                    <div className="relative z-10">
                                        {children}
                                    </div>
                                </main>
                                <ShortcutsModal />
                                <Footer settings={settings} links={links} />
                            </div>
                        </HotkeysProvider>
                    </EditModeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
