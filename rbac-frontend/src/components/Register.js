import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, database } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { TextField, Button, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import bgImage from "../Images/bg-01.jpg";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      const userRef = ref(database, "users/" + user.uid);
      await set(userRef, {
        email: user.email,
        name: name,
        role: "user",
        status: "active",
        emailVerified: user.emailVerified,
        lastLogin: new Date().toString(),
      });

      setError(
        "A verification link has been sent to your email. Please verify it before logging in."
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please try another one.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(
          "An error occurred during registration. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(240, 240, 240, 0.8)",
          zIndex: 1,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: "80px",
            height: "80px",
            backgroundColor: "white",
            margin: "0 auto",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AiOutlineUser size={40} color="#7D4CDB" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: "1rem" }}>
          REGISTER
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginTop: "1rem" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <AiOutlineUser size={20} color="#7D4CDB" />
              <TextField
                variant="standard"
                placeholder="Name"
                fullWidth
                InputProps={{ disableUnderline: true }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ marginLeft: "0.5rem" }}
                required
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <AiOutlineUser size={20} color="#7D4CDB" />
              <TextField
                variant="standard"
                placeholder="Email"
                fullWidth
                InputProps={{ disableUnderline: true }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginLeft: "0.5rem" }}
                required
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <AiOutlineLock size={20} color="#7D4CDB" />
              <TextField
                variant="standard"
                placeholder="Password"
                fullWidth
                type="password"
                InputProps={{ disableUnderline: true }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginLeft: "0.5rem" }}
                required
              />
            </Box>
          </Box>
          {error && (
            <Typography sx={{ color: "red", marginBottom: "1rem" }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              backgroundColor: "#7D4CDB",
              padding: "0.8rem",
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#6a3cb3" },
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <Typography
          variant="body2"
          sx={{ marginTop: "1rem", color: "#7D4CDB", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Typography>
      </motion.div>
    </Box>
  );
}

export default RegisterPage;
