import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-sm fixed top-0 z-50 px-2 sm:px-5 md:px-20 lg:px-40">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/">Works</Link></li>
            <li><Link href="/">Categories</Link></li>
            <li><Link href="/">Support</Link></li>
            <li><Link href="/">Help</Link></li>
          </ul>
        </div>
        <Link href="/" className="text-2xl font-black tracking-tight text-primary btn btn-ghost">
        <Image src="/logo.png" alt="TransportHub" width={130} height={40} style={{ height: 'auto' }} />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/">Works</Link></li>
          <li><Link href="/">Categories</Link></li>
          <li><Link href="/">Support</Link></li>
          <li><Link href="/">Help</Link></li>
        </ul>
      </div>
      <div className="navbar-end gap-3 px-3">
        <Link className="btn btn-wide max-w-24 btn-ghost rounded-full" href="/auth/login">Sign In</Link>
        <Link className="btn btn-wide max-w-24 btn-primary rounded-full" href="/auth/signup">Join</Link>
      </div>
    </nav>
  );
};

export default Navbar;