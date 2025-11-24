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

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "EE Master | Electronic Engineering Platform",
    description: "The ultimate resource for learning Electronic Engineering, from circuits to FPGAs.",
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
            { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
        ],
        apple: '/apple-touch-icon.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
                <AuthProvider>
                    <HotkeysProvider>
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <AITutor />
                            <ShortcutsModal />
                            <Footer />
                        </div>
                    </HotkeysProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
