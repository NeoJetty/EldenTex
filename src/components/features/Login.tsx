import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";
import {
  login as loginAction,
  logout as logoutAction,
} from "../../redux/slices/authSlice";
import axios from "axios";

// Define the shape of the response from the server
interface LoginResponse {
  username: string;
  message: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: StoreTypes) => state.auth.isLoggedIn);

  function logout(): void {
    dispatch(logoutAction());
  }

  const example_users = [
    // this data + encrypted password is on the server
    { id: 1, name: "Alice", email: "alice@example.com", pass: "pass123" },
    { id: 2, name: "Bob", email: "bob@example.com", pass: "secure123" },
    {
      id: 3,
      name: "Charlie",
      email: "charlie@example.com",
      pass: "mypassword",
    },
    { id: 4, name: "Diana", email: "diana@example.com", pass: "letmein" },
    { id: 5, name: "Eve", email: "eve@example.com", pass: "123456" },
    { id: 6, name: "Frank", email: "frank@example.com", pass: "qwerty" },
    { id: 7, name: "Grace", email: "grace@example.com", pass: "password1" },
    { id: 8, name: "Heidi", email: "heidi@example.com", pass: "trustno1" },
    { id: 9, name: "Ivan", email: "ivan@example.com", pass: "iloveyou" },
    { id: 10, name: "Judy", email: "judy@example.com", pass: "sunshine" },
  ];

  function setExampleUser(id: number): void {
    const user = example_users.find((user) => user.id === id);
    if (user) {
      setEmail(user.email);
      setPassword(user.pass);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post<LoginResponse>("/api/login", { email, password })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);

          dispatch(loginAction(response.data.username));
          setMessage(`Login successful! Welcome, ${response.data.username}.`);
        } else {
          setMessage("Login failed. Please check your credentials.");
          dispatch(logoutAction());
        }
      })
      .catch((error) => {
        setMessage(
          `An error occurred. Please try again. Error: ${
            error.response?.data?.message || error.message
          }`
        );
      });
  };

  return (
    <div>
      <h2>Login</h2>
      {!isLoggedIn ? (
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
          <Link to="/register">
            <button>Register</button>
          </Link>
        </form>
      ) : (
        <button onClick={logout} type="button">
          Logout
        </button>
      )}
      {message && <p>{message}</p>}

      {!isLoggedIn && (
        <>
          <h4>Test Users</h4>
          <select onChange={(e) => setExampleUser(Number(e.target.value))}>
            {example_users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default Login;