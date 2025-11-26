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

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "EE Master | Electronic Engineering Platform",
    description: "The ultimate resource for learning Electronic Engineering, from circuits to FPGAs.",
    icons: {
        icon: '/icon_without_text.png',
        apple: '/icon_without_text.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} bg-gray-950 text-white antialiased overflow-x-hidden`}>
                <AuthProvider>
                    <EditModeProvider>
                        <HotkeysProvider>
                            <div className="flex flex-col min-h-screen">
                                <Navbar />
                                <main className="flex-1 w-full relative">
                                    {/* Subtle Blueprint Grid Overlay */}
                                    <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
                                        style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
                                    </div>
                                    <div className="relative z-10">
                                        {children}
                                    </div>
                                </main>
                                <ShortcutsModal />
                                <Footer />
                            </div>
                        </HotkeysProvider>
                    </EditModeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
