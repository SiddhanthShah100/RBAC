import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !user ? <Login /> : <Navigate to="/user-dashboard" replace />
          }
        />
        <Route
          path="/register"
          element={
            !user ? <Register /> : <Navigate to="/user-dashboard" replace />
          }
        />

        <Route
          path="/user-dashboard"
          element={user ? <UserDashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin-dashboard"
          element={user ? <AdminDashboard /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
