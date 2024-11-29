import React, { useState } from "react";
import { Link } from "react-router-dom";

// Define the shape of the response from the server
interface LoginResponse {
  username: string;
  message: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("example@ex.com");
  const [password, setPassword] = useState<string>(
    "$2b$12$/UZZB9chfcEEe7bt8Vtl.eXK09s8QibvYxzPUsqgkbglTlJdBLAZ6"
  );
  const [message, setMessage] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<string>("");

  function logout(): void {
    localStorage.setItem("isLoggedInUser", "");
    setLoggedInUser("");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log(response);

        const data: LoginResponse = await response.json();
        console.log(data);

        localStorage.setItem("isLoggedInUser", data.username);
        setLoggedInUser(data.username);

        setMessage(`Login successful! Welcome, ${data.username}.`);
      } else {
        setMessage("Login failed. Please check your credentials.");
        localStorage.setItem("isLoggedInUser", "");
        setLoggedInUser("");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
        <Link to="../register">
          <button>Register</button>
        </Link>
        {loggedInUser && (
          <button onClick={logout} type="submit">
            Logout
          </button>
        )}
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
