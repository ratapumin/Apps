import Link from "next/link";
import jsCookie from "js-cookie";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { set } from "lodash";

export default function Navbar() {
  const router = useRouter();
  const { asPath } = useRouter();
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    const token = jsCookie.get("jwt");
    setJwt(token);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    jsCookie.remove("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setJwt("");
    router.push("/");
  };

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
      <div className="login-container">
        {user && (
          <>
            <p>Logged in as {user.username}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!user && (
          <Link
            href="/auth/login"
            className={asPath === "/auth/login" ? "list active" : "list"}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
