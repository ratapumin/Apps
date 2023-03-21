import { useEffect, useState } from "react";
import jsCookie from "js-cookie";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
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
    router.push("/auth/login");
  };

  return (
    <>
      <h1>Profile Page</h1>
      {user && (
        <>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </>
      )}
      <p>JWT: {jwt}</p>

      {user && <button onClick={handleLogout}>Logout</button>}
    </>
  );
}
