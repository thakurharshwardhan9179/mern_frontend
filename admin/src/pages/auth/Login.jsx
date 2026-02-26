import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // ✅ FIX: token ko user object ke andar save kar rahe hain
      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
        role: res.data.user.role,
        token: res.data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/member/announcements");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Welcome Back 💪</h2>
        <p className="auth-subtitle">
          Login to continue your fitness journey
        </p>

        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
