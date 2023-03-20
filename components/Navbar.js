import Link from "next/link";

import { useRouter } from "next/router";

import Head from "next/head";

export default function Navbar() {
  const { asPath } = useRouter();

  return (
    <nav className="topnav">
      <Link href="/" className={asPath === "/" ? "list active" : "list"}>
        Home
      </Link>
      <Link
        href="/about"
        className={asPath === "/about" ? "list active" : "list"}
      >
        About
      </Link>
      <Link
        href="/demo"
        className={asPath === "/demo" ? "list active" : "list"}
      >
        Demo
      </Link>
    </nav>
  );
}
