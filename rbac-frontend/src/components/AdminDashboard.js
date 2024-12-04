import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  TableSortLabel,
  IconButton,
} from "@mui/material";
import { database } from "../firebase";
import { ref, set, remove, child, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import bgImage from "../Images/bg-01.jpg";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import { htmlDocx } from "html-docx-js/dist/html-docx";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [newStatus, setNewStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("email");
  const [filters, setFilters] = useState({
    name: "",
    role: "all",
    status: "all",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersRef = ref(database, "users/");
    const snapshot = await get(usersRef);
    const data = snapshot.val();

    if (data) {
      const usersList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setUsers(usersList);
    }
  };

  const addUser = async () => {
    if (!newEmail || !newRole || !newStatus) {
      alert("Please provide all fields.");
      return;
    }
    setLoading(true);

    const newUserRef = ref(database, "users/");
    const newUserId = new Date().getTime().toString();

    try {
      const newUser = {
        emailVerified: null,
        email: newEmail || null,
        lastLogin: null,
        name: null,
        role: newRole || null,
        status: newStatus || null,
      };

      await set(child(newUserRef, newUserId), newUser);

      setNewEmail("");
      setNewRole("user");
      setNewStatus("active");
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  const editUser = async (id, updatedRole, updatedStatus) => {
    setLoading(true);
    const userRef = ref(database, "users/" + id);
    try {
      await set(userRef, {
        ...users.find((user) => user.id === id),
        role: updatedRole,
        status: updatedStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const userRef = ref(database, "users/" + id);
    try {
      await remove(userRef);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 22);
    const tableColumn = ["Name", "Email", "Role", "Status"];
    const tableRows = users.map((user) => [
      user.name || "N/A",
      user.email,
      user.role,
      user.status,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("user-list.pdf");
  };

  const downloadWord = () => {
    const htmlContent = `
      <h1>User List</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (user) => `
            <tr>
              <td>${user.name || "N/A"}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>${user.status}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
    const converted = htmlDocx.asBlob(htmlContent);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = "user-list.docx";
    link.click();
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const sortedUsers = [...users]
    .filter((user) => {
      return (
        (filters.name === "" ||
          user.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.role === "all" || user.role === filters.role) &&
        (filters.status === "all" || user.status === filters.status)
      );
    })
    .sort((a, b) => {
      if (orderBy === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (orderBy === "email") {
        return order === "asc"
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else if (orderBy === "role") {
        return order === "asc"
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      } else if (orderBy === "status") {
        return order === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 2,
        padding: 4,
        backgroundColor: "#f4f6f8",
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
          backgroundColor: "rgba(200, 200, 220, 0.8)",
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
        Admin Dashboard - User Management
      </Typography>

      <Box
        sx={{
          marginBottom: 4,
          padding: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 4,
          marginBottom: 4,
          mx: { xs: 2, sm: 3, md: 10 },
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "black",
            zIndex: 2,
            position: "relative",
            fontFamily: "'Roboto Slab', serif",
            fontWeight: "bold",
          }}
          gutterBottom
        >
          Add New User
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="User Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              onClick={addUser}
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{
                padding: "9px 0",
                fontWeight: 600,
                boxShadow: 2,
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Add User"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 4,
          marginBottom: 4,
          mx: { xs: 2, sm: 3, md: 10 },
          position: "relative",
          zIndex: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "black",
            zIndex: 2,
            position: "relative",
            fontFamily: "'Roboto Slab', serif",
            fontWeight: "bold",
          }}
          gutterBottom
        >
          User List
          {/* <Button onClick={downloadPDF} sx={{ ml: 2 }} variant="outlined" color="primary">
            <PictureAsPdfIcon />
            Download as PDF
          </Button>
          <Button onClick={downloadWord} sx={{ ml: 2 }} variant="outlined" color="primary">
            Download as Word
          </Button> */}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Filter by Name"
              value={filters.name}
              onChange={handleFilterChange}
              name="name"
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={filters.role}
                onChange={handleFilterChange}
                name="role"
                label="Role"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={handleFilterChange}
                name="status"
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleRequestSort("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "role"}
                    direction={orderBy === "role" ? order : "asc"}
                    onClick={() => handleRequestSort("role")}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) =>
                        editUser(user.id, e.target.value, user.status)
                      }
                      size="small"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onChange={(e) =>
                        editUser(user.id, user.role, e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => deleteUser(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
