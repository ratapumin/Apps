import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Navbar() {
  const { asPath } = useRouter();
  return (
    <nav>
      <div className="logo">
        <a href="/">
          <Image src="/psu_th.png" width={100} height={50} alt="logo" />
        </a>
      </div>
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
