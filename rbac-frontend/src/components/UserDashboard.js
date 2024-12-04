import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import bgImage from "../Images/bg-01.jpg";
function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = ref(database, "users/" + user.uid);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.log("No user data found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userData && userData.status !== "active") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#d32f2f", marginBottom: 2, fontWeight: "bold" }}
        >
          Your account is inactive
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          You cannot access any services. Please contact the administrator for
          assistance.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{
            padding: "12px 24px",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 2,
        padding: 4,
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
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
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(240, 240, 240, 0.6)",
          zIndex: 1,
        }}
      />
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "black",
          zIndex: 2,
          position: "relative",
          fontFamily: "'Roboto Slab', serif",
          fontWeight: "bold",
        }}
      >
        My Dashboard
      </Typography>

      <Box
        sx={{
          marginBottom: 4,
          padding: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 4,
          mx: { xs: 2, sm: 3, md: 10 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {userData ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{userData.email}</TableCell>
                  <TableCell>{userData.name}</TableCell>
                  <TableCell>{userData.role}</TableCell>
                  <TableCell>{userData.status}</TableCell>
                  <TableCell>{userData.lastLogin}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{
            padding: "12px 24px",
            fontWeight: 600,
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            marginRight: 2,
          }}
        >
          Logout
        </Button>
        {userData?.role === "admin" && (
          <Button
            variant="contained"
            color="secondary"
            onClick={goToAdminDashboard}
            sx={{
              padding: "12px 24px",
              fontWeight: 600,
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Go to Admin Dashboard
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default UserDashboard;
