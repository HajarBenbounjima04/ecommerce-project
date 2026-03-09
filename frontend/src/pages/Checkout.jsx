import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const { backendUrl, token, userData } = useContext(AppContent);
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    orderNotes: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCart();

    if (userData?.email) {
      setFormData((prev) => ({ ...prev, email: userData.email }));
    }
  }, [token, backendUrl, userData]);

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
          if (!data.cart.items || data.cart.items.length === 0) {
            navigate("/cart");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Invalid phone number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}api/order/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.dispatchEvent(new CustomEvent("cartUpdated"));

        // ✅ Show success notification instead of redirecting
        toast.success(
          `Order placed successfully! Order number: ${data.order.orderNumber}`,
          {
            autoClose: 5000,
            position: "top-center",
          }
        );

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: userData?.email || "",
          orderNotes: "",
        });

        // Optionally, show a modal with options
        setTimeout(() => {
          const continueShop = window.confirm(
            "Order placed successfully! Would you like to continue shopping?"
          );
          if (continueShop) {
            navigate("/shop");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setError(data.message || "Failed to create order");
        toast.error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order. Please try again.");
      toast.error("Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
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
          <span className="ml-3 text-green-700">Loading...</span>
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
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Checkout</h1>
          <p className="text-green-700">Complete your order</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
                <h2 className="text-2xl font-semibold text-amber-900 mb-6">
                  Billing Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      disabled={submitting}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      disabled={submitting}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+212 6XX XXX XXX"
                      className={`w-full px-4 py-2 border ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      disabled={submitting}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      disabled={submitting}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4">
                    Additional Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order notes (optional)
                    </label>
                    <textarea
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      disabled={submitting}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200 sticky top-24">
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  Your Order
                </h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.items?.map((item) => {
                    const product = item.productId;
                    if (!product) return null;

                    return (
                      <div
                        key={item._id}
                        className="flex gap-3 pb-3 border-b border-green-200"
                      >
                        <img
                          src={
                            getLocalImagePath(product.mainImage) ||
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4="
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-900 text-sm">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </p>
                          {item.selectedCharacteristics && (
                            <p className="text-xs text-gray-600">
                              {item.selectedCharacteristics.label}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-700">
                            {(item.priceAtAdd * item.quantity).toFixed(2)} MAD
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      {cart.subtotal?.toFixed(2) || "0.00"} MAD
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="border-t border-green-300 pt-3">
                    <div className="flex justify-between text-lg font-bold text-amber-900">
                      <span>Total:</span>
                      <span>{cart.total?.toFixed(2) || "0.00"} MAD</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
