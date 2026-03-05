import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData, setToken } =
    useContext(AppContent);
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (state === "Sign Up" && !name) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);

    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          if (data.token) {
            setToken(data.token);
          }
          toast.success("Account created successfully!");
          setIsLoggedin(true);
          setTimeout(async () => {
            await getUserData();
            navigate("/");
          }, 100);
        } else {
          toast.error(data.message || "Registration failed");
        }
      } else {
        const { data } = await axios.post(backendUrl + "api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          if (data.token) {
            setToken(data.token);
            localStorage.setItem("token", data.token);
          }
          toast.success("Login successful!");
          setIsLoggedin(true);
          setTimeout(async () => {
            await getUserData();
            navigate("/");
          }, 100);
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(
          "Invalid credentials. Please check your email and password."
        );
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please sign up first.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid request.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-green-100 via-emerald-100 to-amber-100">
      <img
        onClick={() => navigate("/")}
        src={assets.viva}
        alt="Viva Cosmetics"
        className="absolute left-5 sm:left-20 top-5 w-32 sm:w-40 cursor-pointer"
      />

      <div className="bg-gradient-to-br from-amber-900 to-green-900 p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-green-50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-200 mb-2">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-green-200 text-sm">
            {state === "Sign Up"
              ? "Join Viva Cosmetics family"
              : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && (
            <div className="relative">
              <div className="absolute left-4 top-3.5">
                <svg
                  className="w-5 h-5 text-amber-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 bg-green-800/30 border border-green-700/50 rounded-xl text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute left-4 top-3.5">
              <svg
                className="w-5 h-5 text-amber-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 bg-green-800/30 border border-green-700/50 rounded-xl text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              autoComplete="email"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-3.5">
              <svg
                className="w-5 h-5 text-amber-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 bg-green-800/30 border border-green-700/50 rounded-xl text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              autoComplete={
                state === "Sign Up" ? "new-password" : "current-password"
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-amber-300 hover:text-amber-200 transition-colors"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {state === "Login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-amber-300 hover:text-amber-200 text-sm transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : state === "Sign Up" ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {state === "Sign Up" ? (
            <p className="text-green-200 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setState("Login")}
                className="text-amber-300 hover:text-amber-200 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-green-200 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => setState("Sign Up")}
                className="text-amber-300 hover:text-amber-200 font-semibold transition-colors"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-green-700/50">
          <p className="text-center text-xs text-green-300">
            By continuing, you agree to our{" "}
            <button
              onClick={() => navigate("/terms-of-service")}
              className="text-amber-300 hover:underline"
            >
              Terms
            </button>{" "}
            and{" "}
            <button
              onClick={() => navigate("/privacy-policy")}
              className="text-amber-300 hover:underline"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
