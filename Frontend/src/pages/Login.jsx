import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userID", data.user.id);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      navigate("/fileUpload");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg font-mono"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center font-mono">Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 font-mono focus:ring-indigo-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 mb-6 bg-gray-700 border border-gray-600 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-mono font-semibold"
        >
          Login
        </button>

        <div className="mt-6 text-center text-sm font-mono">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-mono">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
