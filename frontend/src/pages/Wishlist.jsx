import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Wishlist = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContent);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, [token, backendUrl]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}api/wishlist`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWishlist(data.wishlist.products);
        } else {
          setError("Failed to load wishlist");
        }
      } else {
        setError(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `${backendUrl}api/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWishlist(data.wishlist.products);
        }
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const clearWishlist = async () => {
    if (
      !window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/wishlist/clear`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  const getLocalImagePath = (imageUrl) => {
    if (!imageUrl) return null;
    if (!imageUrl.includes("https://your-storage.com/")) {
      return imageUrl;
    }
    const fullFilename = imageUrl.split("/").pop();
    const cleanFilename = fullFilename.replace(/^main_\d+_/, "");
    return `/assets/${cleanFilename}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-green-700">Loading wishlist...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-green-700">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            for later
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-gradient-to-r from-amber-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Clear All Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear All
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => {
                const product = item.productId;
                if (!product) return null;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-green-100 group"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={
                          getLocalImagePath(product.mainImage) ||
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+"
                        }
                        alt={product.name}
                        className="w-full h-56 object-cover cursor-pointer"
                        onClick={() =>
                          navigate(`/product/${product.slug || product._id}`)
                        }
                      />

                      {/* Stock Badge */}
                      {!product.inStock && (
                        <div className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Out of Stock
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <h3
                        className="font-semibold text-amber-900 mb-2 line-clamp-2 cursor-pointer hover:text-amber-700"
                        onClick={() =>
                          navigate(`/product/${product.slug || product._id}`)
                        }
                      >
                        {product.name}
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        {product.category}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-amber-700">
                          {product.basePrice
                            ? product.basePrice.toFixed(2)
                            : "0.00"}{" "}
                          MAD
                        </span>

                        <button
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            product.inStock
                              ? "bg-amber-600 text-white hover:bg-amber-700"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!product.inStock}
                          onClick={() => {
                            // Add to cart logic here
                            console.log("Add to cart:", product._id);
                          }}
                        >
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>

                      {/* Added Date */}
                      <p className="text-xs text-gray-500 mt-3">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/shop")}
                className="bg-gradient-to-r from-green-600 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-amber-700 transition-all duration-200 transform hover:scale-105"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
