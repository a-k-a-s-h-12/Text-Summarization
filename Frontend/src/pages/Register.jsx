import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", formData);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
      >
        <h2 className="font-mono text-xl font-semibold text-gray-300 mb-6 text-center uppercase tracking-wider">
          Register
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 font-mono text-base mb-2 uppercase tracking-wider">
              Name
            </label>
            <input
              name="name"
              placeholder="ENTER YOUR NAME"
              required
              onChange={handleChange}
              className="font-mono w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent tracking-wider text-sm"
            />
          </div>

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
          Register
        </button>

        <div className="mt-6 text-center">
          <label className="text-gray-400 font-mono text-sm tracking-wider">
            ALREADY HAVE AN ACCOUNT?
          </label>
          <Link
            to="/login"
            className="ml-2 font-mono text-indigo-400 hover:text-indigo-300 text-sm uppercase tracking-wider transition-colors duration-200"
          >
            LOGIN
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
