import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://text-summarization-backend.onrender.com/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userID", res.data.user.id);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      navigate("/fileUpload");
    } catch (error) {
      alert(error.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
      >
        <h2 className="font-mono text-xl font-semibold text-gray-300 mb-6 text-center uppercase tracking-wider">
          Login
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 font-mono text-base mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="ENTER EMAIL"
              required
              onChange={handleChange}
              className="font-mono w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent tracking-wider text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-mono text-base mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="ENTER PASSWORD"
              required
              onChange={handleChange}
              className="font-mono w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent tracking-wider text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="font-mono w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg text-base uppercase tracking-wider transition-colors duration-200"
        >
          Login
        </button>

        <div className="mt-6 text-center">
          <label className="text-gray-400 font-mono text-sm tracking-wider">
            CREATE ACCOUNT?
          </label>
          <Link
            to="/register"
            className="ml-2 font-mono text-indigo-400 hover:text-indigo-300 text-sm uppercase tracking-wider transition-colors duration-200"
          >
            REGISTER
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
