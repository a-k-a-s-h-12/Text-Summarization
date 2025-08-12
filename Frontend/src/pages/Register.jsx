import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://text-summarization-backend.onrender.com/auth/register",
        formData
      );
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-12">
      {/* Added container for better margin control */}
      <div className="w-full max-w-2xl mx-4">
        {/* Added mx-auto for centering */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg font-mono mx-auto my-8"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center font-mono">
            Register
          </h2>

          <input
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm sm:text-base"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm sm:text-base"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 mb-6 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm sm:text-base"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 sm:py-3 rounded-lg font-semibold font-mono text-sm sm:text-base transition duration-200"
          >
            Register
          </button>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm font-mono">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-mono transition duration-200"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
