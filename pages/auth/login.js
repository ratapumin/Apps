import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jsCookie from "js-cookie";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // add state for login status
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(
        "user",
        JSON.stringify({ username: email, email, token: jsCookie.get("jwt") })
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    const loginForm = await Swal.fire({
      title: "Login Form",
      html: `<input type="text" id="email" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Password">`,
      showConfirmButton: true,
      showCancelButton: true,
    });

    const email = Swal.getPopup().querySelector("#email").value;
    const password = Swal.getPopup().querySelector("#password").value;

    try {
      const res = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: email,
        password: password,
      });

      if (res.status === 200) {
        const { username, email } = res.data.user;
        const token = res.data.jwt;
        jsCookie.set("jwt", token);
        localStorage.setItem(
          "user",
          JSON.stringify({ username, email, token })
        );
        window.alert("Login successful!");
        window.alert("Welcome: " + username);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
      Swal.showValidationMessage("Invalid login credentials");
    }
  };

  const handleLogout = () => {
    jsCookie.remove("jwt");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <p>Welcome, {JSON.parse(localStorage.getItem("user")).username}</p>
        </>
      ) : (
        <>
          <button onClick={handleLogin}>Login</button>
          <p>{errorMessage}</p>
        </>
      )}
    </div>
  );
}
