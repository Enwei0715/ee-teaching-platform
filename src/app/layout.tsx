import type { Metadata } from "next";
import "./globals.css";
import 'katex/dist/katex.min.css';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import AITutor from "@/components/ai/AITutor";

export const metadata: Metadata = {
    title: "EE Master | Electronic Engineering Platform",
    description: "The ultimate resource for learning Electronic Engineering, from circuits to FPGAs.",
};

import HotkeysProvider from "@/context/HotkeysProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <HotkeysProvider>
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <AITutor />
                            <Footer />
                        </div>
                    </HotkeysProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
