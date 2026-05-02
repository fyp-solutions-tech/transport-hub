"use client"
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { loginAction, type FormState } from "@/actions/auth";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import Image from "next/image";

const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const [passwordReveal, setPasswordReveal] = useState<boolean>(false);

    useEffect(() => {
        if (state.success) {
            window.location.href = "/dashboard";
        }
    }, [state.success]);

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `/auth/onboarding?intendedRole=USER`
        });
    };

    return (
        <main className="grow flex flex-col items-center justify-center px-4 min-h-screen bg-base-100">
            <div className="w-full max-w-7xl">
                <Link href="/" className="text-2xl font-black tracking-tight text-primary btn btn-ghost py-6">
                    <Image src="/logo.png" alt="TransportHub" width={150} height={150} />
                </Link>
            </div>
            <div className="w-full max-w-[440px] bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)] hover:-translate-y-[2px] transition-all duration-300 border border-base-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-base-content mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-base-content/70">Log in to manage your travels</p>
                </div>
                <div className="space-y-6">
                    <button onClick={handleGoogleLogin} disabled={isPending} type="button" className="w-full flex items-center justify-center gap-3 mb-5 py-3.5 px-4 bg-white border border-base-300 rounded-lg font-semibold text-sm text-base-content hover:bg-base-200 transition-all active:scale-95 duration-200 disabled:opacity-50">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Continue with Google
                    </button>
                    <div className="relative flex items-center">
                        <div className="grow border-t border-base-300"></div>
                        <span className="shrink mx-4 text-xs text-base-content/50 uppercase tracking-widest">or</span>
                        <div className="grow border-t border-base-300"></div>
                    </div>

                    {state.message && !state.success && (
                        <div className="p-3 rounded-lg bg-error/10 text-error text-sm text-center">
                            {state.message}
                        </div>
                    )}

                    <form className="space-y-5" action={formAction}>
                        <div>
                            <label className="block font-semibold text-sm text-base-content mb-2" htmlFor="email">Email Address</label>
                            <input name="email" required className="w-full px-4 py-3 rounded-lg border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content bg-white" id="email" placeholder="name@company.com" type="email" />
                            {state.errors?.email && <span className="text-xs text-error mt-1">{state.errors.email}</span>}
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block font-semibold text-sm text-base-content" htmlFor="password">Password</label>
                                <a className="text-xs text-primary font-semibold hover:underline" href="#">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <input name="password" required className="w-full px-4 py-3 rounded-lg border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content bg-white" id="password" placeholder="••••••••" type={passwordReveal ? "text" : "password"} />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors" type="button" onClick={() => setPasswordReveal(!passwordReveal)}>
                                    {passwordReveal ? <IoMdEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
                                </button>
                            </div>
                            {state.errors?.password && <span className="text-xs text-error mt-1">{state.errors.password}</span>}
                        </div>
                        <button disabled={isPending} className="w-full py-3.5 bg-primary text-primary-content font-semibold text-sm rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] duration-200 mt-2 disabled:opacity-70 flex justify-center items-center" type="submit">
                            {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Sign In"}
                        </button>
                    </form>
                    <div className="text-center pt-2 flex flex-col items-center gap-2">
                        <p className="text-base-content/70">
                            Don't have an account?{" "}
                            <Link className="text-primary font-bold hover:underline" href="/auth/signup">Sign up</Link>
                        </p>
                        <p className="text-base-content/70">
                            Want to drive with us?{" "}
                            <Link className="text-primary font-bold hover:underline" href="/auth/driver">Driver Portal</Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-50/50 via-base-100 to-base-100 pointer-events-none"></div>
        </main>
    );
}
