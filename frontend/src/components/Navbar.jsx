import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [wishlistPreview, setWishlistPreview] = useState([]);
  const [cartPreview, setCartPreview] = useState({ items: [], total: 0 });
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const wishlistTimeoutRef = useRef(null);
  const cartTimeoutRef = useRef(null);

  const { userData, backendUrl, setUserData, setIsLoggedin, token, setToken } =
    useContext(AppContent);

  useEffect(() => {
    if (token) {
      fetchWishlistCount();
      fetchCartCount();
    } else {
      setWishlistCount(0);
      setCartCount(0);
    }
  }, [token, backendUrl]);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (token) {
        fetchWishlistCount();
        setWishlistPreview([]);
      }
    };

    const handleCartUpdate = () => {
      if (token) {
        fetchCartCount();
        setCartPreview({ items: [], total: 0 });
      }
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [token]);

  const fetchWishlistCount = async () => {
    try {
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
          setWishlistCount(data.wishlist.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`${backendUrl}api/cart`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartCount(data.cart.itemCount || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleWishlistHover = async () => {
    if (!token || wishlistCount === 0) return;

    if (wishlistTimeoutRef.current) {
      clearTimeout(wishlistTimeoutRef.current);
    }

    wishlistTimeoutRef.current = setTimeout(async () => {
      setShowWishlistPreview(true);

      if (wishlistPreview.length === 0) {
        setIsLoadingWishlist(true);
        try {
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
              setWishlistPreview(data.wishlist.products.slice(0, 3));
            }
          }
        } catch (error) {
          console.error("Error fetching wishlist preview:", error);
        } finally {
          setIsLoadingWishlist(false);
        }
      }
    }, 300);
  };

  const handleWishlistLeave = () => {
    if (wishlistTimeoutRef.current) {
      clearTimeout(wishlistTimeoutRef.current);
    }
    setTimeout(() => {
      setShowWishlistPreview(false);
    }, 200);
  };

  const handleCartHover = async () => {
    if (!token || cartCount === 0) return;

    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }

    cartTimeoutRef.current = setTimeout(async () => {
      setShowCartPreview(true);

      if (cartPreview.items.length === 0) {
        setIsLoadingCart(true);
        try {
          const response = await fetch(`${backendUrl}api/cart`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setCartPreview({
                items: data.cart.items.slice(0, 3),
                total: data.cart.total,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching cart preview:", error);
        } finally {
          setIsLoadingCart(false);
        }
      }
    }, 300);
  };

  const handleCartLeave = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }
    setTimeout(() => {
      setShowCartPreview(false);
    }, 200);
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

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/verify-email");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Navigate to product details
  const handleProductClick = (product) => {
    const identifier = product.slug || product._id;
    navigate(`/product/${identifier}`);
    setShowWishlistPreview(false);
    setShowCartPreview(false);
  };

  // Dans menuItems, remplace:
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/#categories", scroll: true }, // ✅ Ajout scroll flag
    { name: "About us", path: "/about" },
    { name: "Shop", path: "/shop" },
  ];

  // Dans le render, modifie le onClick:
  {
    menuItems.map((item) => (
      <button
        key={item.name}
        onClick={() => {
          if (item.scroll) {
            // ✅ Si on est déjà sur home, scroll direct
            if (window.location.pathname === "/") {
              document.getElementById("categories")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } else {
              // Sinon navigate puis scroll
              navigate("/");
              setTimeout(() => {
                document.getElementById("categories")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 300);
            }
          } else {
            navigate(item.path);
          }
        }}
        className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
      >
        {item.name}
      </button>
    ));
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src={assets.viva}
              alt="Viva Cosmetics"
              className="h-10 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/contact")}
              className="hidden sm:flex text-gray-700 hover:text-emerald-600 text-sm font-medium transition-colors duration-200"
            >
              Contact us
            </button>

            <div
              className="relative"
              onMouseEnter={handleWishlistHover}
              onMouseLeave={handleWishlistLeave}
            >
              <button
                onClick={() =>
                  token ? navigate("/wishlist") : navigate("/login")
                }
                className="p-2 text-gray-700 hover:text-emerald-600 relative"
              >
                <svg
                  className="w-6 h-6"
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
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {showWishlistPreview && token && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  onMouseEnter={() => setShowWishlistPreview(true)}
                  onMouseLeave={handleWishlistLeave}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">My Wishlist</h3>
                    <p className="text-sm text-gray-600">
                      {wishlistCount} items
                    </p>
                  </div>

                  {isLoadingWishlist ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                  ) : wishlistPreview.length > 0 ? (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {wishlistPreview.map((item) => {
                          const product = item.productId;
                          if (!product) return null;

                          return (
                            <div
                              key={product._id}
                              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3"
                              onClick={() => handleProductClick(product)}
                            >
                              <img
                                src={
                                  getLocalImagePath(product.mainImage) ||
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4="
                                }
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {product.category}
                                </p>
                                <p className="text-sm font-semibold text-emerald-600 mt-1">
                                  {product.basePrice
                                    ? product.basePrice.toFixed(2)
                                    : "0.00"}{" "}
                                  MAD
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            navigate("/wishlist");
                            setShowWishlistPreview(false);
                          }}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
                        >
                          View All ({wishlistCount})
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>Your wishlist is empty</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={handleCartHover}
              onMouseLeave={handleCartLeave}
            >
              <button
                onClick={() => (token ? navigate("/cart") : navigate("/login"))}
                className="p-2 text-gray-700 hover:text-emerald-600 relative"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {showCartPreview && token && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  onMouseEnter={() => setShowCartPreview(true)}
                  onMouseLeave={handleCartLeave}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Shopping Cart
                    </h3>
                    <p className="text-sm text-gray-600">{cartCount} items</p>
                  </div>

                  {isLoadingCart ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                  ) : cartPreview.items.length > 0 ? (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {cartPreview.items.map((item, index) => {
                          const product = item.productId;
                          if (!product) return null;

                          return (
                            <div
                              key={`${product._id}-${index}`}
                              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3"
                              onClick={() => handleProductClick(product)}
                            >
                              <img
                                src={
                                  getLocalImagePath(product.mainImage) ||
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4="
                                }
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-semibold text-emerald-600 mt-1">
                                  {(item.priceAtAdd * item.quantity).toFixed(2)}{" "}
                                  MAD
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 border-t border-gray-200">
                        <div className="flex justify-between mb-3">
                          <span className="font-semibold text-gray-900">
                            Total:
                          </span>
                          <span className="font-bold text-emerald-600">
                            {cartPreview.total.toFixed(2)} MAD
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigate("/cart");
                            setShowCartPreview(false);
                          }}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
                        >
                          View Cart ({cartCount})
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>Your cart is empty</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {userData ? (
              <div className="relative group">
                <div className="w-8 h-8 flex justify-center items-center rounded-full bg-emerald-600 text-white cursor-pointer">
                  {userData.name[0].toUpperCase()}
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">


                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
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
                Login
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-emerald-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate("/contact");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md"
              >
                Contact us
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
