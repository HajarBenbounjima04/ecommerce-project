import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-white bg-opacity-30"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 mb-4">
                Natural Beauty Products
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Beautifully,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-600">
                  Naturally
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Because everyone deserves to be beautiful, Viva-Cosmetics.net
                offers quality, natural products that enhance your beauty while
                caring for your skin and the planet.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={() => navigate("/shop")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate("/about")}
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                Learn More
              </button>
            </div>

            {/* User Greeting */}
            {userData && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-700">
                <span className="text-lg">Welcome back, {userData.name}!</span>
                <div className="w-6 h-6">
                  <img
                    src={assets.hand_wave}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="photo1" // You mentioned you'll name them yourself
                alt="Natural Beauty Products"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              {/* Floating product cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      100% Natural
                    </p>
                    <p className="text-xs text-gray-600">Cruelty Free</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 animate-float animation-delay-2000">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Eco-Friendly
                    </p>
                    <p className="text-xs text-gray-600">Sustainable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Header;
