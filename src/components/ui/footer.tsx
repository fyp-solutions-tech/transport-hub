import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
            <aside>
                <Link href="/" className="text-2xl font-black tracking-tight text-primary btn btn-xl btn-ghost">
                    <Image src="/logo.png" alt="TransportHub" width={250} height={250} />
                </Link>
                <p className="flex gap-2 font-light mx-8 my-3">
                    <span>Safety</span>
                    <span>•</span>
                    <span>Fast</span>
                    <span>•</span>
                    <span>Rapid</span>
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Branding</a>
                <a className="link link-hover">Design</a>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Jobs</a>
                <a className="link link-hover">Press kit</a>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
                <a className="link link-hover">Cookie policy</a>
            </nav>
        </footer>
    )
}

export default Footer
