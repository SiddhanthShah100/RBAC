const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { auth, database } = require("./firebase");
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.post("/api/users", async (req, res) => {
  try {
    const { uid, name, email, role, status } = req.body;

    const roleRef = database.ref("roles/" + role);
    const roleSnapshot = await roleRef.once("value");
    if (!roleSnapshot.exists()) {
      return res.status(400).send("Invalid role");
    }

    const userRef = database.ref("users/" + uid);
    const userSnapshot = await userRef.once("value");
    if (userSnapshot.exists()) {
      return res.status(400).send("User already exists");
    }

    await userRef.set({ name, email, role, status });
    res.status(201).send("User Created");
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Error creating user: " + error.message);
  }
});

app.put("/api/users/:uid/role", async (req, res) => {
  try {
    const { role } = req.body;

    const roleRef = database.ref("roles/" + role);
    const roleSnapshot = await roleRef.once("value");
    if (!roleSnapshot.exists()) {
      return res.status(400).send("Invalid role");
    }

    const userRef = database.ref("users/" + req.params.uid);
    const userSnapshot = await userRef.once("value");
    if (!userSnapshot.exists()) {
      return res.status(404).send("User not found");
    }

    await userRef.update({ role });
    res.send("Role Assigned");
  } catch (error) {
    console.error("Error assigning role:", error.message);
    res.status(500).send("Error assigning role: " + error.message);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    const userRef = database.ref("users/" + user.uid);
    const snapshot = await userRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).send("User not found");
    }

    const userData = snapshot.val();

    if (userData.status !== "active") {
      return res
        .status(403)
        .send("Your account is inactive. Please contact support.");
    }

    res.json({
      message: "Login successful",
      user: {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send("Error during login: " + error.message);
  }
});

app.get("/api/roles/:role/permissions", async (req, res) => {
  try {
    const roleRef = database.ref("roles/" + req.params.role + "/permissions");
    const snapshot = await roleRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).send("Role not found");
    }
    res.json(snapshot.val());
  } catch (error) {
    console.error("Error fetching permissions:", error.message);
    res.status(500).send("Error fetching permissions: " + error.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello, server is running!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
