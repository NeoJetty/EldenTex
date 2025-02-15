import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";
import {
  login as loginAction,
  logout as logoutAction,
} from "../../redux/slices/authSlice";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

// Define the shape of the response from the server
interface LoginResponse {
  message: string;
  username: string;
}

// Function to hash the password with salt using SHA-256
export const hashPasswordWithSalt = async (password: string, salt: string) => {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);

  const combinedData = new Uint8Array(passwordData.length + saltData.length);
  combinedData.set(passwordData);
  combinedData.set(saltData, passwordData.length);

  const hashBuffer = await crypto.subtle.digest("SHA-256", combinedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [exampleUserSelected, setExampleUserSelected] = useState<string>(``);
  const [message, setMessage] = useState<string>("");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: StoreTypes) => state.auth.isLoggedIn);

  function logout(): void {
    setMessage("");
    dispatch(logoutAction());
  }

  const example_users = [
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

  function setExampleUser(id: string): void {
    setExampleUserSelected(id);
    if (id !== ``) {
      const user = example_users.find((user) => user.id === Number(id));
      if (user) {
        setEmail(user.email);
        setPassword(user.pass);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Hash the password with the salt before sending it
      const hashedPassword = await hashPasswordWithSalt(
        password,
        "BetterStartRunningYourRainbowTableGenerator"
      );

      // Send the hashed password to the server
      axios
        .post<LoginResponse>("/api/login", { email, hashedPassword })
        .then((response) => {
          if (response.status === 200) {
            dispatch(loginAction(response.data.username));
            setMessage(`Login successful! Welcome, ${response.data.username}.`);
            setEmail("");
            setPassword("");
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
    } catch (error) {
      setMessage(`Error during password hashing: ${(error as Error).message}`);
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label="eMail"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
          <Link
            to="/register"
            style={{ textDecoration: "none", marginLeft: "10px" }}
          >
            <Button variant="outlined">Register</Button>
          </Link>
        </form>
      ) : (
        <Button variant="contained" color="secondary" onClick={logout}>
          Logout
        </Button>
      )}
      {message && <Typography color="textPrimary">{message}</Typography>}

      {!isLoggedIn && (
        <>
          <br />
          <Typography variant="h6" gutterBottom>
            Test Users
          </Typography>
          <FormControl margin="dense" style={{ width: "50%" }}>
            <InputLabel id="example-user-select-label"></InputLabel>
            <Select
              labelId="example-user-select-label"
              value={exampleUserSelected}
              onChange={(e) => setExampleUser(e.target.value)}
              defaultValue={``}
            >
              <MenuItem key={``} value={``} disabled>
                {"- pick -"}
              </MenuItem>
              {example_users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </Container>
  );
};

export default Login;
