import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import API_SERVICE from "../../helpers/service/apiService";
import { DEFAULT_ERROR_MESSAGE } from "../../helpers/constant/utils";
import toast from "react-toast";

const { STAGE_CRAFTO } = API_SERVICE;

const fieldsConfig = [
  { label: "User Name", name: "userName" },
  { label: "OTP", name: "otp" },
];

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <a
        color="inherit"
        rel="noReferrer"
        target="_blank"
        href="https://github.com/rohitsoni98/kutumb-app"
      >
        Github Repo Link
      </a>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
};

const LoginPage = () => {
  const [state, setState] = useState({
    userName: "",
    otp: "",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    token && navigate("/quote-list");
  }, [token]);

  const onChangeFields = ({ target: { value, name } }) => {
    name === "otp" && isNaN(value)
      ? toast.error("accepts only number.", { id: "numberError" })
      : setState((prev) => ({ ...prev, [name]: value }));
  };

  const checkValidation = () => {
    const { otp, userName } = state;
    if (!otp || !userName)
      return toast.error("User Name & Otp both fields are mandatory.", {
        id: "error",
      });

    return false;
  };

  const onLogin = async () => {
    try {
      const { userName, otp } = state;
      const response = await STAGE_CRAFTO.post("/login", {
        otp,
        username: userName,
      });
      localStorage.setItem("auth_token", response?.["data"]?.["token"] || "");
      localStorage.setItem("user_name", userName.toUpperCase());
      window.location = "/quote-list";
    } catch (err) {
      toast.error(err?.["message"] || DEFAULT_ERROR_MESSAGE);
    }
  };

  const onSubmit = () => {
    if (checkValidation()) return;
    onLogin();
  };

  return (
    <Stack
      height="100vh"
      padding="16px"
      bgcolor="#f2f2f2"
      alignItems="center"
      justifyContent="center"
    >
      <CssBaseline />
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography fontSize="22px" fontWeight="500" textAlign="center">
        Sign in to your account
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        {fieldsConfig.map((item, index) => (
          <TextField
            required
            fullWidth
            key={index}
            name={item["name"]}
            label={item["label"]}
            size={"small"}
            margin={"normal"}
            value={state[item["name"]]}
            onChange={onChangeFields}
            helperText={
              item["name"] === "otp" && (
                <span>
                  Note: Use <strong>1234</strong> as an otp for logging.
                </span>
              )
            }
          />
        ))}
      </Box>

      <Button
        sx={{ mt: 3 }}
        type={"submit"}
        variant={"contained"}
        onClick={onSubmit}
        disabled={!state["otp"] || !state["userName"]}
      >
        Sign In
      </Button>

      <Copyright sx={{ mt: "32px" }} />
    </Stack>
  );
};

export default LoginPage;
