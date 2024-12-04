import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import bgImage from "../Images/bg-01.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { ref, get } from "firebase/database";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User signed in:", user.uid);

      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("User data:", userData);
        console.log(userData.status);
        if (userData.status !== "active") {
          setError("Your account is inactive. Please contact support.");
          console.log("Inactive");
          return;
        }

        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "user") {
          navigate("/user-dashboard");
        } else {
          setError("Invalid role assigned to the user.");
        }
      } else {
        setError("No user data found.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email address.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred during login. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(240, 240, 240, 0.8)",
          zIndex: 2,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
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
          <motion.div animate={{ scale: 1 }} transition={{ duration: 0 }}>
            <AiOutlineUser size={40} color="#7D4CDB" />
          </motion.div>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: "1rem" }}>
          LOG IN
        </Typography>
        <form onSubmit={handleLogin}>
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
                placeholder="Email"
                fullWidth
                InputProps={{ disableUnderline: true }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginLeft: "0.5rem" }}
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
              />
            </Box>
          </Box>
          {error && (
            <Typography color="error" sx={{ marginBottom: "1rem" }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#7D4CDB",
              padding: "0.8rem",
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#6a3cb3" },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Typography
          variant="body2"
          sx={{ marginTop: "1rem", color: "#7D4CDB", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </Typography>
      </motion.div>
    </Box>
  );
}

export default LoginPage;
