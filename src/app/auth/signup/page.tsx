"use client"
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { registerAction, type FormState } from "@/actions/auth";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
};

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(registerAction, initialState);

    useEffect(() => {
        if (state.success) {
            window.location.href = "/auth/onboarding?intendedRole=USER";
        }
    }, [state.success]);

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `/auth/onboarding?intendedRole=USER`
        });
    };

    return (
        <main className="grow flex flex-col items-center justify-center py-10 px-4 min-h-screen bg-base-100">
            <div className="w-full max-w-7xl">
                <Link href="/" className="text-2xl font-black tracking-tight text-primary btn btn-ghost py-6">
                    <Image src="/logo.png" alt="TransportHub" width={150} height={150} />
                </Link>
            </div>
            <div className="w-full max-w-7xl grid md:grid-cols-2 gap-12 items-center">
                {/* Branding/Image Section */}
                <div className="hidden md:block space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold text-base-content leading-tight tracking-tight">Your journey starts with a single click.</h1>
                        <p className="text-lg text-base-content/70 max-w-xl">Join thousands of travelers who trust TransportHub for seamless, efficient, and reliable transit scheduling across the globe.</p>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/3">
                        <img className="object-cover w-full h-full" alt="High speed train" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAYpJ05TR0VGOt_VweZDQu-gBnGLiTC-1byl78vGqTtekgZGsGggzBMgMmH2YGbWaY9UU-itO2_vUaVtDWghs2OWRQ_ZLnD2VTU3gm5Xnhr_r49w9dIRHOO38Sv3rY6aQRUezbl6ofd2ysiywcv7B5rM2_Re99v_6nzltDUDFdWpH-NRB8MmqSL8A4NGBBv3BCKbd2G0_4w3lrQXAOLOwm8PnWNEp6u8XlObOvTSmsXZx8cOB7UR9c0qIiEHBVE17yQWbthmNvcUQ" />
                        <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent"></div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full max-w-lg mx-auto">
                    <div className="bg-white p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgba(37,99,235,0.04)] border border-base-300">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-semibold text-base-content mb-2 tracking-tight">Create an account</h2>
                            <p className="text-base-content/70">Join TransportHub to manage your bookings</p>
                        </div>

                        {/* Social Login */}
                        <button onClick={handleGoogleLogin} disabled={isPending} type="button" className="w-full flex items-center justify-center gap-3 mb-5 py-3.5 px-4 bg-white border border-base-300 rounded-lg font-semibold text-sm text-base-content hover:bg-base-200 transition-all active:scale-95 duration-200 disabled:opacity-50">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-base-300"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-base-content/50 text-xs uppercase tracking-wider">or email</span></div>
                        </div>

                        {state.message && !state.success && (
                            <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm text-center">
                                {state.message}
                            </div>
                        )}

                        {/* Signup Form */}
                        <form className="space-y-5" action={formAction}>
                            <div className="space-y-1.5">
                                <label className="font-semibold text-sm text-base-content/80 block ml-1" htmlFor="name">Full Name</label>
                                <input name="name" required id="name" className="w-full px-4 py-3 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-base-content outline-none" placeholder="John Doe" type="text" autoComplete="name" />
                                {state.errors?.name && <span className="text-xs text-error mt-1">{state.errors.name}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="font-semibold text-sm text-base-content/80 block ml-1" htmlFor="email">Email Address</label>
                                <input name="email" required id="email" className="w-full px-4 py-3 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-base-content outline-none" placeholder="name@example.com" type="email" autoComplete="email" />
                                {state.errors?.email && <span className="text-xs text-error mt-1">{state.errors.email}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="font-semibold text-sm text-base-content/80 block ml-1" htmlFor="password">Password</label>
                                <input name="password" required id="password" className="w-full px-4 py-3 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-base-content outline-none" placeholder="••••••••" type="password" autoComplete="new-password" />
                                {state.errors?.password && <span className="text-xs text-error mt-1">{state.errors.password}</span>}
                            </div>
                            <div className="flex items-start gap-3 py-2">
                                <input name="terms" required className="mt-1 w-4 h-4 text-primary border-base-300 rounded focus:ring-primary/20 cursor-pointer" id="terms" type="checkbox" />
                                <label className="text-xs text-base-content/70" htmlFor="terms">
                                    I agree to the <Link className="text-primary hover:underline" href="#">Terms of Service</Link> and <Link className="text-primary hover:underline" href="#">Privacy Policy</Link>.
                                </label>
                            </div>
                            <button disabled={isPending} className="w-full bg-primary text-primary-content py-4 rounded-lg font-semibold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center" type="submit">
                                {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Create Account"}
                            </button>
                        </form>
                        <div className="mt-8 text-center flex flex-col items-center gap-2">
                            <p className="text-base-content/70">
                                Already have an account?
                                <Link className="text-primary font-semibold hover:underline ml-1" href="/auth/login">Log in</Link>
                            </p>
                            <p className="text-base-content/70">
                                Want to drive with us?
                                <Link className="text-primary font-semibold hover:underline ml-1" href="/auth/driver">Driver Portal</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
