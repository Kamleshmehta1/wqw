import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllDataQuery } from "../../features";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { loginMethod } from "../../createSlice";

function Page(props) {
  const [input, setInput] = useState({
    email: [""],
    password: [""],
    confirmPassword: [""],
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllDataQuery();

  const sendRequest = async () => {
    let data;
    await axios
      .post("http://localhost:4000/users?userData", {
        email: input.email[0],
        password: input.password[0],
        blogList: [],
      })
      .then((response) => (data = response.data))
      .catch((err) => console.log(err));
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      input.email[0] === "" &&
      input.password[0] === "" &&
      input.confirmPassword[0] === ""
    ) {
      toast.error("Kindly enter proper input!");
      setInput({
        email: [""],
        password: [""],
        confirmPassword: [""],
      });
      return;
    }

    if (props.type === "LOGIN") {
      if (
        data.userData.some(
          (ele) =>
            ele.email === input.email[0] && ele.password === input.password[0]
        )
      ) {
        Cookies.set("loginState", input.email[0], { expires: 3600 });
        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
        if (Cookies.get("loginState")) {
          dispatch(loginMethod(true));
          toast.success("Login successfully !");
          navigate("/feed");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } else {
      if (input.password[0] !== input.confirmPassword[0]) {
        toast.warning("Password is not matching!");
        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
        return;
      }
      if (!isLoading && data.userData.some((ele) => ele.email === input.email[0])) {
        toast.warning("Email id already Present!");
        return;
      } else {
        sendRequest();
        toast.success("Sign Up successfully !");
        setInput({
          email: [""],
          password: [""],
          confirmPassword: [""],
        });
      }
    }
  };

  const theme = createTheme();

  const handleChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: [e.target.value],
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {props.type}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              value={input.email[0] || ""}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={input.password[0] || ""}
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
              autoComplete="current-password"
            />
            {props.type === "SIGNUP" ? (
              <TextField
                margin="normal"
                required
                fullWidth
                value={input.confirmPassword[0] || ""}
                name="confirmPassword"
                label="Confirm Password"
                type="confirmPassword"
                id="confirmPassword"
                onChange={handleChange}
                autoComplete="current-password"
              />
            ) : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {props.type}
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default Page;
