import React, { useState } from "react";
import axios from "axios";
import { hashPasswordWithSalt } from "./Login"; // Ensure this function is correctly imported

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
      // Hash the password with a salt before sending it to the backend
      const hashedPassword = await hashPasswordWithSalt(
        password,
        "BetterStartRunningYourRainbowTableGenerator"
      );
      console.log({
        email,
        hashedPassword,
      });
      // Send the registration request using axios
      const response = await axios.post<RegisterResponse>("/api/register", {
        email,
        hashedPassword,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setServerMessage(`Registration successful! Welcome, ${data.username}.`);
      } else {
        setServerMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      setServerMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register new Account</h2>
      <label>
        Username (email):
        <input
          type="email"
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
      <button type="submit">Register</button>

      {serverMessage && <p>{serverMessage}</p>}
    </form>
  );
};

export default Register;
