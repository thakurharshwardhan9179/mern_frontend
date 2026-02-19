import { useState } from "react";
import API from "../../api/axios";
import "./auth.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Signup data:", form); // 👈 DEBUG

    try {
      await API.post("/auth/signup", form);
      alert("Signup successful");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>

      <form onSubmit={submitHandler}>
        <input
          name="name"
          placeholder="Name"
          onChange={changeHandler}
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={changeHandler}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={changeHandler}
          required
        />

        {/* 👇 THIS IS THE KEY FIX */}
        <select name="role" onChange={changeHandler}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
