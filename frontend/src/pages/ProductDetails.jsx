// ProductDetails.jsx - Enhanced Design (No Minimum Order)
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContent);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [identifier, backendUrl]);

  useEffect(() => {
    if (token && product) {
      checkWishlistStatus();
    }
  }, [token, product]);

  useEffect(() => {
    if (product) {
      calculatePrice();
    }
  }, [product, selectedCharacteristics, quantity]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}api/products/${identifier}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          setCalculatedPrice(data.product.basePrice);
          initializeCharacteristics(data.product);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeCharacteristics = (productData) => {
    const initial = {};

    productData.characteristics?.forEach((char) => {
      if (char.type === "size" && char.sizeOptions?.length > 0) {
        const firstSize = char.sizeOptions[0];
        initial[char.name] = `${firstSize.value}${firstSize.unit}`;
      } else if (char.type === "material" && char.materialOptions?.length > 0) {
        initial[char.name] = char.materialOptions[0].name;
      } else if (char.options?.length > 0) {
        initial[char.name] = char.options[0].value;
      }
    });

    setSelectedCharacteristics(initial);
  };

  const calculatePrice = () => {
    if (!product) return;

    let price = product.basePrice;
    let applicableTiers = product.quantityTiers || [];

    product.characteristics?.forEach((char) => {
      const selection = selectedCharacteristics[char.name];
      if (!selection) return;

      if (char.type === "size" && char.sizeOptions) {
        const selected = char.sizeOptions.find(
          (s) => `${s.value}${s.unit}` === selection
        );
        if (selected) {
          price = selected.price;
          if (selected.quantityTiers?.length > 0) {
            applicableTiers = selected.quantityTiers;
          }
        }
      }

      if (char.type === "material" && char.materialOptions) {
        const selected = char.materialOptions.find((m) => m.name === selection);
        if (selected) {
          price = selected.isPercentage
            ? price * (1 + selected.priceModifier / 100)
            : price + selected.priceModifier;
        }
      }

      if (char.options) {
        const selected = char.options.find((o) => o.value === selection);
        if (selected) {
          price = selected.price;
          if (selected.quantityTiers?.length > 0) {
            applicableTiers = selected.quantityTiers;
          }
        }
      }
    });

    // Apply quantity-based pricing tiers if quantity meets minimum
    if (applicableTiers.length > 0) {
      const tier = applicableTiers.find(
        (t) => quantity >= t.minQuantity && quantity <= t.maxQuantity
      );
      if (tier) {
        price = tier.price;
      }
    }

    setCalculatedPrice(Math.round(price * 100) / 100);
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}api/wishlist`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const inList = data.wishlist.products.some(
            (item) => item.productId._id === product._id
          );
          setIsInWishlist(inList);
        }
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/wishlist/toggle`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
        window.dispatchEvent(new CustomEvent("wishlistUpdated"));
        toast.success(
          data.inWishlist ? "Added to wishlist" : "Removed from wishlist"
        );
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      const body = {
        productId: product._id,
        quantity,
        characteristics: selectedCharacteristics,
      };

      const response = await fetch(`${backendUrl}api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        toast.success("Product added to cart!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const getLocalImagePath = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes("https://your-storage.com/"))
      return imageUrl;
    const cleanFilename = imageUrl
      .split("/")
      .pop()
      .replace(/^(main_|img_)\d+_(\d+_)?/, "");
    return `/assets/${cleanFilename}`;
  };

  const getCurrentTiers = () => {
    let tiers = product.quantityTiers || [];

    product.characteristics?.forEach((char) => {
      const selection = selectedCharacteristics[char.name];

      if (char.type === "size" && char.sizeOptions) {
        const selected = char.sizeOptions.find(
          (s) => `${s.value}${s.unit}` === selection
        );
        if (selected?.quantityTiers?.length > 0) {
          tiers = selected.quantityTiers;
        }
      } else if (char.options) {
        const selected = char.options.find((o) => o.value === selection);
        if (selected?.quantityTiers?.length > 0) {
          tiers = selected.quantityTiers;
        }
      }
    });

    return tiers;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-green-700">Loading product...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = [product.mainImage, ...(product.images || [])].filter(
    Boolean
  );
  const currentTiers = getCurrentTiers();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center text-green-700 hover:text-green-800 mb-6 transition-colors font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={
                  getLocalImagePath(allImages[selectedImage]) ||
                  "/api/placeholder/600/600"
                }
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-xl overflow-hidden border-3 transition-all transform ${
                      selectedImage === idx
                        ? "border-amber-500 scale-105 shadow-lg ring-2 ring-amber-200"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <img
                      src={getLocalImagePath(img) || "/api/placeholder/150/150"}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Price</p>
                  <span className="text-5xl font-bold text-amber-700">
                    {calculatedPrice.toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-600 ml-2">MAD</span>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    product.inStock
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              {calculatedPrice !== product.basePrice && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <span className="text-sm text-gray-500 line-through">
                    Base Price: {product.basePrice.toFixed(2)} MAD
                  </span>
                </div>
              )}
            </div>

            {/* Dynamic Characteristics */}
            {product.characteristics?.map((char) => (
              <div
                key={char.name}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              >
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Select {char.name}
                </label>

                {/* Size Options with Dropdown */}
                {char.type === "size" &&
                  char.sizeOptions &&
                  char.sizeOptions.length > 0 && (
                    <select
                      value={selectedCharacteristics[char.name] || ""}
                      onChange={(e) =>
                        setSelectedCharacteristics((prev) => ({
                          ...prev,
                          [char.name]: e.target.value,
                        }))
                      }
                      className="w-full p-4 border-2 border-gray-300 rounded-xl font-medium text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    >
                      {char.sizeOptions.map((size) => {
                        const sizeValue = `${size.value}${size.unit}`;
                        return (
                          <option key={sizeValue} value={sizeValue}>
                            {sizeValue} - {size.price.toFixed(2)} MAD
                          </option>
                        );
                      })}
                    </select>
                  )}

                {/* Material Options */}
                {char.type === "material" &&
                  char.materialOptions &&
                  char.materialOptions.length > 0 && (
                    <div className="space-y-3">
                      {char.materialOptions.map((material) => {
                        const isSelected =
                          selectedCharacteristics[char.name] === material.name;

                        return (
                          <button
                            key={material.name}
                            onClick={() =>
                              setSelectedCharacteristics((prev) => ({
                                ...prev,
                                [char.name]: material.name,
                              }))
                            }
                            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                              isSelected
                                ? "border-amber-500 bg-amber-50 shadow-lg ring-2 ring-amber-200"
                                : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-900">
                                {material.name}
                              </span>
                              {material.priceModifier !== 0 && (
                                <span className="text-amber-600 font-bold">
                                  {material.priceModifier > 0 ? "+" : ""}
                                  {material.priceModifier}
                                  {material.isPercentage ? "%" : " MAD"}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                {/* Combined Options (Size & Material) with Dropdown */}
                {char.options && char.options.length > 0 && (
                  <select
                    value={selectedCharacteristics[char.name] || ""}
                    onChange={(e) =>
                      setSelectedCharacteristics((prev) => ({
                        ...prev,
                        [char.name]: e.target.value,
                      }))
                    }
                    className="w-full p-4 border-2 border-gray-300 rounded-xl font-medium text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  >
                    {char.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.price.toFixed(2)} MAD
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {/* Quantity Pricing Table - Only show if tiers exist */}
            {currentTiers.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white">
                    Bulk Pricing Available
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Quantity Range
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          You Save
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentTiers.map((tier, idx) => {
                        const isActive =
                          quantity >= tier.minQuantity &&
                          quantity <= tier.maxQuantity;
                        const savings =
                          idx > 0 ? currentTiers[0].price - tier.price : 0;

                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isActive
                                ? "bg-green-50 border-l-4 border-green-500"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`font-medium ${
                                  isActive
                                    ? "text-green-900 text-lg"
                                    : "text-gray-700"
                                }`}
                              >
                                {isActive && "→ "}
                                {tier.minQuantity} - {tier.maxQuantity} units
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span
                                className={`font-bold ${
                                  isActive
                                    ? "text-green-700 text-xl"
                                    : "text-gray-900 text-lg"
                                }`}
                              >
                                {tier.price.toFixed(2)} MAD
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {savings > 0 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                  -{savings.toFixed(2)} MAD
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-6 py-4 hover:bg-gray-100 font-bold text-xl text-gray-700 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, val));
                    }}
                    min={1}
                    className="w-24 text-center border-x-2 border-gray-300 py-4 focus:outline-none font-bold text-xl"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-6 py-4 hover:bg-gray-100 font-bold text-xl text-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total & Actions */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {(calculatedPrice * quantity).toFixed(2)}
                    <span className="text-xl text-gray-600 ml-2">MAD</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {quantity} × {calculatedPrice.toFixed(2)} MAD
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={toggleWishlist}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    isInWishlist
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-600"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill={isInWishlist ? "currentColor" : "none"}
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
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addingToCart}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                    product.inStock
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {addingToCart
                    ? "Adding..."
                    : product.inStock
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/shop")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
