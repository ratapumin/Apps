import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jsCookie from "js-cookie";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const { email, token } = JSON.parse(user);
      setEmail(email);
      setIsLoggedIn(true);
      jsCookie.set("jwt", token);
    }
  }, []);

  const handleLogin = async (props) => {
    let email = "";
    let password = "";

    const loginForm = await Swal.fire({
      title: "Login Form",
      html: `<input type="text" id="email" class="swal2-input" placeholder="Email">
             <input type="password" id="password" class="swal2-input" placeholder="Password">`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login",
      cancelButtonText: "Close",
      didClose: () => {
        if (!email || !password) {
          setEmail("");
          setPassword("");
        }
      },
      preConfirm: () => {
        if (
          !document.getElementById("email").value ||
          !document.getElementById("password").value
        ) {
          Swal.showValidationMessage(`Unable to pass null`);
        }
      },
    });
    email = Swal.getPopup().querySelector("#email").value;
    password = Swal.getPopup().querySelector("#password").value;

    if (loginForm.isConfirmed) {
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
          Swal.fire({
            title: "Login successful!",
            text: "Welcome " + username,
            icon: "success",
            showConfirmButton: false,
            timer: 1200,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1200);
          setIsLoggedIn(true);
        }
      } catch (error) {
        Swal.fire({
          title: "Login failed!",
          text: "Invalid email or password",
          icon: "error",
          showConfirmButton: false,
          timer: 1200,
        });
        setIsLoggedIn(false);
        setTimeout(() => {
          email = "";
          password = "";
          handleLogin(props);
        }, 1200);
      }
    }
  };

  const handleLogout = () => {
    jsCookie.remove("jwt");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div>
      {isLoggedIn && localStorage.getItem("user") && (
        <>
          <button onClick={handleLogout}>Logout</button>
          <p>{JSON.parse(localStorage.getItem("user")).username}</p>
        </>
      )}
      {!isLoggedIn && (
        <>
          <button onClick={handleLogin}>Login</button>
          <p>{errorMessage}</p>
        </>
      )}
    </div>
  );
}
