import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContent);
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [token, backendUrl]);

  const fetchCart = async () => {
    try {
      setLoading(true);
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
          setCart(data.cart);
        } else {
          setError("Failed to load cart");
        }
      } else {
        setError(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const getItemKey = (item) => {
    // تأكد من أن item._id موجود
    if (item._id) {
      return item._id;
    }

    // إذا لم يكن موجود، استخدم مفتاح مركب
    return `${item.productId._id}-${item.selectedSize?.value || "none"}-${
      item.selectedMaterial?.name || "none"
    }`;
  };
  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    const itemKey = getItemKey(item);
    setUpdatingItems((prev) => new Set(prev).add(itemKey));

    try {
      // ✅ Envoie itemId dans l'URL, pas dans le body
      const response = await fetch(`${backendUrl}api/cart/update/${item._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: newQuantity, // Seulement quantity dans le body
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCart(data.cart);
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };
  const removeFromCart = async (item) => {
    console.log("=== FRONTEND REMOVE REQUEST ===");
    console.log("Item _id:", item._id);

    try {
      const response = await fetch(`${backendUrl}api/cart/remove/${item._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // لا حاجة لـ body هنا
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCart(data.cart);
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
      } else {
        const errorData = await response.json();
        console.error("Response not OK:", errorData);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCart({ items: [], subtotal: 0, total: 0 });
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
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
          <span className="ml-3 text-green-700">Loading cart...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-green-700">
            {cart.items?.length || 0}{" "}
            {cart.items?.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!cart.items || cart.items.length === 0 ? (
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding products to your cart!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-gradient-to-r from-amber-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-amber-900">
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
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
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;
                  const itemKey = getItemKey(item);

                  return (
                    <div
                      key={itemKey}
                      className="bg-white rounded-lg shadow-md p-4 border border-green-100"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            getLocalImagePath(product.mainImage) ||
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4="
                          }
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded cursor-pointer"
                          onClick={() =>
                            navigate(`/product/${product.slug || product._id}`)
                          }
                        />

                        <div className="flex-1">
                          <h3
                            className="font-semibold text-amber-900 mb-1 cursor-pointer hover:text-amber-700"
                            onClick={() =>
                              navigate(
                                `/product/${product.slug || product._id}`
                              )
                            }
                          >
                            {product.name}
                          </h3>
                          <p className="text-sm text-green-700 mb-2">
                            {product.category}
                          </p>

                          {item.selectedSize && (
                            <p className="text-sm text-gray-600">
                              Size: {item.selectedSize.value}
                              {item.selectedSize.unit}
                            </p>
                          )}

                          {item.selectedMaterial && (
                            <p className="text-sm text-gray-600">
                              Material: {item.selectedMaterial.name}
                            </p>
                          )}
                          {item.selectedCharacteristics && (
                            <p className="text-sm text-gray-600">
                              {item.selectedCharacteristics.label}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() =>
                                  updateQuantity(item, item.quantity - 1)
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  updatingItems.has(itemKey)
                                }
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 1;
                                  updateQuantity(item, value);
                                }}
                                className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none"
                                disabled={updatingItems.has(itemKey)}
                              />
                              <button
                                onClick={() =>
                                  updateQuantity(item, item.quantity + 1)
                                }
                                disabled={updatingItems.has(itemKey)}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-700">
                            {(item.priceAtAdd * item.quantity).toFixed(2)} MAD
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.priceAtAdd.toFixed(2)} MAD each
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200 sticky top-24">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      {cart.subtotal?.toFixed(2) || "0.00"} MAD
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className="font-semibold">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-green-300 pt-3">
                    <div className="flex justify-between text-lg font-bold text-amber-900">
                      <span>Total:</span>
                      <span>{cart.total?.toFixed(2) || "0.00"} MAD</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-amber-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-green-700 transition-all mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/shop")}
                  className="w-full border border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
