"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdMarkEmailRead } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";

export default function WaitingPage() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleCancel = async () => {
        setIsLoggingOut(true);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/signup");
                },
            },
        });
    };

    return (
        <main className="grow flex items-center justify-center pt-24 pb-16 px-4 min-h-screen bg-base-100">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgba(37,99,235,0.04)] border border-base-200 text-center space-y-6">
                
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-2">
                    <span className="material-symbols-outlined text-4xl"><MdMarkEmailRead /></span>
                </div>

                <div>
                    <h2 className="text-3xl font-semibold text-base-content tracking-tight">Verify your email</h2>
                    <p className="text-base-content/70 mt-3 text-sm leading-relaxed">
                        We've sent a verification link to your email address. Please click the link to verify your account and access your dashboard.
                    </p>
                </div>

                <div className="pt-4 space-y-3">
                    <a 
                        href="https://mail.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-primary text-primary-content py-3 rounded-lg font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl"><GoArrowUpRight /></span>
                        Open Gmail
                    </a>
                    
                    <Link
                        href="/dashboard"
                        className="w-full bg-base-200 text-base-content py-3 rounded-lg font-semibold text-sm hover:bg-base-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                    >
                        I have verified my email
                    </Link>
                </div>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-base-300"></div></div>
                    <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-base-content/50 uppercase tracking-widest">or</span></div>
                </div>

                <button 
                    onClick={handleCancel}
                    disabled={isLoggingOut}
                    className="w-full border border-error/30 text-error bg-error/5 py-3 rounded-lg font-semibold text-sm hover:bg-error/10 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoggingOut ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Cancel & Return to Signup"
                    )}
                </button>

            </div>
        </main>
    );
}
