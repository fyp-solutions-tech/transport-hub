// src/components/layouts/form.tsx
"use client"
import { FaUserLock } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useActionState, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import type { AuthProps } from "@/app/auth/[page]/page";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { loginAction, registerAction, type FormState } from "@/actions/auth";

const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
};

const FormLayout = (
    { page, para = false }: AuthProps & { para?: boolean }
) => {
    const [state, formAction, isPending] = useActionState(page == "signup" ? registerAction : loginAction, initialState)
    const [passwordReveal, setPasswordReveal] = useState<boolean>(true)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const pageSelection = page === "signup" ? "login" : "signup"
    const pageSelectionBool = page === "signup" ? true : false
    const arg = para ? "DRIVER" : "USER"

    useEffect(() => {
        if (state.success) {
            if (para) {
                window.location.href = "/driver/dashboard";
            } else {
                window.location.href = "/dashboard";
            }
        }
    }, [state.success, para]);

    const handlePasswordReveal = () => {
        setPasswordReveal(!passwordReveal)
    }
    const handleLogin = async (role: "USER" | "DRIVER") => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `/auth/onboarding?intendedRole=${role}`
        });
    };

    const handleChange = (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="bg-white md:h-screen overflow-hidden">
            <div className="grid md:grid-cols-2 items-center gap-8 h-full">
                <div className="max-md:order-1 p-4 hidden md:block">
                    <Image
                        src="/auth-image.png"
                        alt="Transport Hub - Login & Signup"
                        width={1000}
                        height={1000}
                        className="block"
                        priority={true}
                        loading="eager"
                    />
                </div>

                <div className="flex items-center p-8 bg-[#0C172C] h-full lg:w-11/12 lg:ml-auto">
                    <form className="max-w-lg w-full mx-auto" action={formAction}>
                        <div className="mb-12">
                            <h1 className="text-3xl font-semibold text-primary capitalize">{pageSelectionBool ? "signup" : "login to"} your account</h1>
                            <p className="text-sm text-slate-300 mt-2">{pageSelectionBool ? "Already" : "Don't"} have an account? <Link href={`/auth/${pageSelection}`} className="text-primary font-medium hover:underline ml-1 capitalize">{pageSelection} here</Link> {pageSelectionBool && (<>| <Link className="text-primary font-medium hover:underline ml-1 capitalize" href={`/auth/${para ? "signup" : "driver"}`}>{para ? "User" : "Driver"} Account</Link></>)} </p>
                        </div>

                        {pageSelectionBool && (
                            <div>
                                <label className="text-white text-xs block mb-2">{para ? "Driver" : "Full"} Name</label>
                                <div className="relative flex items-center">
                                    <input name="name" type="text" value={data.name} onChange={handleChange("name")} required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter name" autoComplete="name" />
                                    <FaUserLock className="size-5 absolute right-2" />
                                </div>
                            </div>
                        )}
                        <div className="mt-8">
                            <label className="text-white text-xs block mb-2">Email</label>
                            <div className="relative flex items-center">
                                <input name="email" type="text" value={data.email} onChange={handleChange("email")} required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter email" autoComplete="email" />
                                <LuMail className="size-5 absolute right-2" />
                            </div>
                        </div>
                        <div className="mt-8">
                            <label className="text-white text-xs block mb-2">Password</label>
                            <div className="relative flex items-center">
                                <input name="password" type={passwordReveal ? "password" : "text"} value={data.password} onChange={handleChange("password")} required className="w-full bg-transparent text-sm text-white border-b border-slate-500 focus:border-white pl-2 pr-8 py-3 outline-none" placeholder="Enter password" autoComplete="new-password" />
                                <span className="absolute right-2 cursor-pointer" onClick={() => handlePasswordReveal()}>
                                    {passwordReveal ? (
                                        <IoEye className="size-5" />
                                    ) : (
                                        <IoMdEyeOff className="size-5" />
                                    )}
                                </span>
                            </div>
                        </div>
                        {pageSelectionBool && (
                            <div className="flex items-center mt-8">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 rounded" />
                                <label htmlFor="remember-me" className="text-slate-300 ml-3 block text-sm">
                                    I accept the <a href="javascript:void(0);" className="text-primary  font-medium hover:underline ml-1">Terms and Conditions</a>
                                </label>
                            </div>
                        )}

                        <div className="mt-4 space-y-8">
                            <button type="submit" disabled={isPending} className="btn btn-wide max-w-full btn-primary">
                                {pageSelectionBool ? "Register" : "Login"}
                            </button>
                            <div className="divider">Or continue with</div>
                            <button type="button" disabled={isPending} className="btn btn-wide max-w-full bg-white text-black border-[#e5e5e5]" onClick={() => handleLogin(arg)}>
                                <FcGoogle className="size-4" />
                                {page === "signup" ? `Continue as ${para ? "Driver (Start Earning)" : "Passenger"}` : "Continue with Google"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormLayout;