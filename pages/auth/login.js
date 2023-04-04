import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jsCookie from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: email,
        password,
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
        window.alert("welcome :" + username);
        location.reload("/");
      } else {
        setErrorMessage("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {errorMessage && <p>{errorMessage}</p>}

      <button type="submit" href="../index.js">
        Login
      </button>
    </form>
  );
}
