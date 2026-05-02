"use client"
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { registerAction, type FormState } from "@/actions/auth";
import { MdAccountBalance } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { RiMotorbikeFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa6";
import { FaCar as Car } from "react-icons/fa";
import Image from "next/image";

const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
};

export default function DriverSignupPage() {
    const [state, formAction, isPending] = useActionState(registerAction, initialState);

    useEffect(() => {
        if (state.success) {
            window.location.href = "/auth/onboarding?intendedRole=DRIVER";
        }
    }, [state.success]);

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `/auth/onboarding?intendedRole=DRIVER`
        });
    };

    return (
        <main className="grow pt-15 pb-16 flex flex-col justify-center items-center min-h-screen bg-base-100">
            <div className="w-full max-w-7xl">
                <Link href="/" className="text-2xl font-black tracking-tight text-primary btn btn-ghost py-6">
                    <Image src="/logo.png" alt="TransportHub" width={150} height={150} />
                </Link>
            </div>
            <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left Column: Hero & Value Props */}
                <section className="lg:col-span-5 space-y-10 py-8">

                    <div className="space-y-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-content text-xs font-semibold">
                            Become a Partner
                        </span>
                        <h1 className="text-5xl font-bold text-base-content leading-tight tracking-tight">Drive with TransportHub</h1>
                        <p className="text-lg text-base-content/70 leading-relaxed">
                            Join the platform that puts drivers first. Set your own schedule, earn competitive rates, and access 24/7 support.
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div className="flex gap-4 p-6 bg-white rounded-xl shadow-[0_8px_30px_rgba(37,99,235,0.05)] border border-base-300">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined text-2xl"><MdAccountBalance /></span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-base-content mb-1">High Earning Potential</h3>
                                <p className="text-base-content/70 text-sm">Keep a larger share of every fare with our industry-leading commission rates.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-6 bg-white rounded-xl shadow-[0_8px_30px_rgba(37,99,235,0.05)] border border-base-300">
                            <div className="w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined text-2xl"><FaRegCalendarCheck /></span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-base-content mb-1">Total Flexibility</h3>
                                <p className="text-base-content/70 text-sm">Be your own boss. Work whenever you want—full-time or just a few hours a week.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden aspect-video group">
                        <img alt="Driver life" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfXbocVUqG1enCb2fySBFbpf9BTsBDpOJHMVGtKXA5fHw2HOOUnJMz0zhh3XfsserXR2jRNfxedOQ-2FvWRKbjG-AuiYpDm8_yuILrjCALau78J2eHlxsIPuLIRj2W1VIkSHV8MmTIUSk7XOY6X2KKPgco01is58QKtJBkSfG9L-9I2HGaUmusojMP0sWfrssFMi9fMciYDCmkGbPfFplL88WSdbt2oUB9rjF9ft2290gtuVWzglPXU4veaa8zT_KwWpr5neA--XY" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white font-semibold italic">"I increased my monthly income by 40% since switching to TransportHub." — Marco, Partner since 2022</p>
                        </div>
                    </div>
                </section>

                {/* Right Column: Registration Form */}
                <section className="lg:col-span-7">
                    <div className="bg-white rounded-xl p-8 lg:p-12 shadow-[0_12px_40px_rgba(37,99,235,0.06)] border border-base-300">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-semibold text-base-content mb-2 tracking-tight">Create Driver Account</h2>
                            <p className="text-base-content/70">Start your journey with us in just a few minutes.</p>
                        </div>

                        <button onClick={handleGoogleLogin} disabled={isPending} type="button" className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-base-300 rounded-lg font-semibold text-sm text-base-content hover:bg-base-200 transition-all active:scale-95 duration-200 disabled:opacity-50">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-base-300"></div></div>
                            <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-base-content/50 uppercase tracking-widest">or register manually</span></div>
                        </div>

                        {state.message && !state.success && (
                            <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm text-center">
                                {state.message}
                            </div>
                        )}

                        <form className="space-y-6" action={formAction}>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-base-content" htmlFor="name">Full Name</label>
                                    <input name="name" required className="w-full rounded-lg border border-base-300 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content" id="name" placeholder="John Doe" type="text" autoComplete="name" />
                                    {state.errors?.name && <span className="text-xs text-error mt-1">{state.errors.name}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-base-content" htmlFor="email">Email Address</label>
                                    <input name="email" required className="w-full rounded-lg border border-base-300 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content" id="email" placeholder="name@example.com" type="email" autoComplete="email"/>
                                    {state.errors?.email && <span className="text-xs text-error mt-1">{state.errors.email}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-base-content" htmlFor="password">Password</label>
                                    <input name="password" required className="w-full rounded-lg border border-base-300 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content" id="password" placeholder="••••••••" type="password" autoComplete="new-password" />
                                    {state.errors?.password && <span className="text-xs text-error mt-1">{state.errors.password}</span>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-base-content" htmlFor="city">City</label>
                                    <input name="city" required className="w-full rounded-lg border border-base-300 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content" id="city" placeholder="e.g. London" type="text" autoComplete="address-level2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-base-content" htmlFor="license">License Number</label>
                                    <input name="license" required className="w-full rounded-lg border border-base-300 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content" id="license" placeholder="ABC-12345-6789" type="text" autoComplete="license-number" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-base-content">Vehicle Type</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <label className="relative flex flex-col items-center justify-center p-4 border border-base-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-2 has-checked:ring-primary/20">
                                        <input className="absolute opacity-0" name="vehicle" type="radio" value="bike" />
                                        <span className="material-symbols-outlined text-3xl mb-2 text-base-content/40 group-hover:text-primary"><RiMotorbikeFill /></span>
                                        <span className="font-semibold text-sm text-base-content">Bike</span>
                                    </label>
                                    <label className="relative flex flex-col items-center justify-center p-4 border border-base-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-2 has-checked:ring-primary/20">
                                        <input defaultChecked className="absolute opacity-0" name="vehicle" type="radio" value="economy" />
                                        <span className="material-symbols-outlined text-3xl mb-2 text-base-content/40 group-hover:text-primary"><FaCar /></span>
                                        <span className="font-semibold text-sm text-base-content">Economy</span>
                                    </label>
                                    <label className="relative flex flex-col items-center justify-center p-4 border border-base-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-2 has-checked:ring-primary/20">
                                        <input className="absolute opacity-0" name="vehicle" type="radio" value="comfort" />
                                        <span className="material-symbols-outlined text-3xl mb-2 text-base-content/40 group-hover:text-primary"><Car /></span>
                                        <span className="font-semibold text-sm text-base-content">Comfort</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pt-2">
                                <input required className="mt-1 rounded text-primary focus:ring-primary/20 border-base-300" id="terms" type="checkbox" />
                                <label className="text-xs text-base-content/70" htmlFor="terms">
                                    By signing up, I agree to the <Link className="text-primary hover:underline" href="#">Terms of Service</Link> and <Link className="text-primary hover:underline" href="#">Privacy Policy</Link>, and consent to background checks as required by local regulations.
                                </label>
                            </div>
                            <button disabled={isPending} className="w-full bg-primary text-primary-content py-4 rounded-lg font-bold text-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center" type="submit">
                                {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Start Application"}
                            </button>
                        </form>
                        <p className="text-center mt-8 text-sm text-base-content/70">
                            Already have an account? <Link className="text-primary font-semibold hover:underline" href="/auth/login">Log in</Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}