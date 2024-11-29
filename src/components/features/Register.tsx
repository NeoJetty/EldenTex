import React, { useState } from "react";

interface RegisterResponse {
  username: string;
  message: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [serverMessage, setServerMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log(response);

        const data: RegisterResponse = await response.json();
        console.log(data);

        setServerMessage(data.message);

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
    <form onSubmit={handleSubmit}>
      <h2>Register new Account</h2>
      <label>
        Username:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">register</button>
    </form>
  );
};

export default Register;
