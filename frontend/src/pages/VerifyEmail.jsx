import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);
  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        backendUrl + "api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

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
          <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-amber-300"
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
          <h2 className="text-3xl font-bold text-amber-200 mb-2">
            Verify Your Email
          </h2>
          <p className="text-green-200 text-sm">
            Enter the 6-digit code sent to your email address
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-green-800/30 border border-green-700/50 text-white text-center text-xl rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            Verify Email
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-green-200 text-sm">
            Didn't receive the code?{" "}
            <button
              onClick={async () => {
                try {
                  const { data } = await axios.post(
                    backendUrl + "api/auth/resend-verification"
                  );
                  if (data.success) {
                    toast.success("Verification code resent!");
                  } else {
                    toast.error(data.message);
                  }
                } catch (error) {
                  toast.error("Failed to resend code");
                }
              }}
              className="text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              Resend Code
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-green-700/50">
          <p className="text-center text-xs text-green-300">
            Having trouble? Contact support at{" "}
            <a
              href="mailto:support@vivacosmetics.com"
              className="text-amber-300 hover:underline"
            >
              support@vivacosmetics.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
