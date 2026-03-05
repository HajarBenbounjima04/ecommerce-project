import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";

const Home = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContent);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [showVariantModal, setShowVariantModal] = useState(null);
  const [productQuantities, setProductQuantities] = useState({});
  const categoriesSectionRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === "#categories") {
      setTimeout(() => {
        categoriesSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}api/products?limit=8`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.products) {
            setFeaturedProducts(data.products);
          } else {
            setError("Failed to load products");
          }
        } else {
          setError(`Server error: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl]);

  useEffect(() => {
    if (token) {
      fetchWishlistItems();
    }
  }, [token, backendUrl]);

  const fetchWishlistItems = async () => {
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
        if (data.success && data.wishlist.products) {
          const productIds = new Set(
            data.wishlist.products.map((item) => item.productId._id)
          );
          setWishlistItems(productIds);
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  const toggleWishlist = async (productId, e) => {
    e.stopPropagation();
    e.preventDefault();

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
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newWishlistItems = new Set(wishlistItems);
          if (data.inWishlist) {
            newWishlistItems.add(productId);
          } else {
            newWishlistItems.delete(productId);
          }
          setWishlistItems(newWishlistItems);
          window.dispatchEvent(new CustomEvent("wishlistUpdated"));
        }
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const handleAddToCartClick = (product, e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    const quantity = productQuantities[product._id] || 1;
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasMaterials = product.materials && product.materials.length > 0;

    if (hasSizes || hasMaterials) {
      setShowVariantModal({ ...product, initialQuantity: quantity });
    } else {
      addToCart(product._id, null, null, quantity);
    }
  };

  const updateProductQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const addToCart = async (
    productId,
    selectedSize,
    selectedMaterial,
    quantity
  ) => {
    setAddingToCart((prev) => new Set(prev).add(productId));

    try {
      const body = { productId, quantity };
      if (selectedSize) body.selectedSize = selectedSize;
      if (selectedMaterial) body.selectedMaterial = selectedMaterial;

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
        const data = await response.json();
        if (data.success) {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          setShowVariantModal(null);
        }
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const VariantModal = ({ product, onClose, onConfirm }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [quantity, setQuantity] = useState(product.initialQuantity || 1);

    useEffect(() => {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.materials && product.materials.length > 0) {
        setSelectedMaterial(product.materials[0]);
      }
    }, [product]);

    const handleConfirm = () => {
      onConfirm(product._id, selectedSize, selectedMaterial, quantity);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-amber-900">
              Select Options
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-green-700 font-medium">{product.name}</p>
            <p className="text-amber-700 text-lg font-bold">
              {product.basePrice.toFixed(2)} MAD
            </p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSize?.value === size.value
                        ? "border-amber-600 bg-amber-50 text-amber-700"
                        : "border-gray-300 hover:border-amber-400"
                    }`}
                  >
                    {size.value}
                    {size.unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.materials && product.materials.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <div className="space-y-2">
                {product.materials.map((material, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMaterial(material)}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      selectedMaterial?.name === material.name
                        ? "border-amber-600 bg-amber-50"
                        : "border-gray-300 hover:border-amber-400"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {material.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-amber-600 to-green-600 text-white py-2 rounded-lg font-medium hover:from-amber-700 hover:to-green-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  const categories = [
    {
      name: "Hydrolate",
      description:
        "Pure floral waters and hydrosols extracted through steam distillation for natural skincare benefits",
      image: assets.Hydrolate,
      path: "/categories/hydrolate",
    },
    {
      name: "Argan Products",
      description:
        "Premium collection of beauty products enriched with pure Moroccan argan oil",
      image: assets.Argan_Products,
      path: "/categories/argan-products",
    },
    {
      name: "Oils",
      description:
        "Selection of pure, natural oils for comprehensive skincare and wellness",
      image: assets.oil,
      path: "/categories/oils",
    },
    {
      name: "Para Pharma",
      description:
        "Premium para-pharma products formulated with natural ingredients like Moroccan argan oil",
      image: assets.Parapharma,
      path: "/categories/para-pharma",
    },
    {
      name: "Skin Care",
      description:
        "Complete range of premium skincare products for a radiant and healthy complexion",
      image: assets.Skin_care,
      path: "/categories/skin-care",
    },
  ];

  const skinTypes = [
    {
      type: "Normal skin",
      description: "Balanced with no major concerns",
      advice: "Maintain balance with gentle and regular care",
      color: "bg-green-200 text-green-800",
    },
    {
      type: "Dry Skin",
      description: "Lacks hydration and sebum",
      advice: "Choose rich textures and nourishing oils",
      color: "bg-amber-200 text-amber-800",
    },
    {
      type: "Oily Skin",
      description: "Excess sebum and shine",
      advice: "Use mattifying and purifying products",
      color: "bg-yellow-200 text-yellow-800",
    },
    {
      type: "Combination Skin",
      description: "Oily T-zone with normal to dry cheeks",
      advice: "Adapt your care according to facial zones",
      color: "bg-emerald-200 text-emerald-800",
    },
  ];

  const ProductImage = ({ product }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const getLocalImagePath = (imageUrl) => {
      if (!imageUrl) return null;
      if (!imageUrl.includes("https://your-storage.com/")) {
        return imageUrl;
      }
      const fullFilename = imageUrl.split("/").pop();
      const cleanFilename = fullFilename.replace(/^main_\d+_/, "");
      return `/assets/${cleanFilename}`;
    };

    const localImagePath = getLocalImagePath(product.mainImage);

    return (
      <div className="relative w-full h-48">
        {!imageLoaded && !imageError && (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        )}

        <img
          src={
            localImagePath ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+"
          }
          alt={product.name}
          className={`w-full h-48 object-cover ${!imageLoaded ? "hidden" : ""}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            setImageLoaded(true);
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+";
          }}
        />

        {!product.inStock && (
          <div className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}

        <button
          onClick={(e) => toggleWishlist(product._id, e)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              wishlistItems.has(product._id)
                ? "text-red-500 fill-red-500"
                : "text-green-600 hover:text-amber-700"
            }`}
            fill={wishlistItems.has(product._id) ? "currentColor" : "none"}
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Header categoriesSectionRef={categoriesSectionRef} />

      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Our Promise
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              We are committed to creating beauty products that respect your
              skin, animals, and our planet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-green-100">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-700"
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
              <h3 className="text-xl font-semibold mb-3 text-amber-800">
                Inclusive Skin Tone Range
              </h3>
              <p className="text-green-700">
                Our products are thoughtfully formulated to complement and
                enhance every skin tone, ensuring everyone finds their perfect
                match.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-700"
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
              <h3 className="text-xl font-semibold mb-3 text-amber-800">
                Not Tested on Animals
              </h3>
              <p className="text-green-700">
                We are proudly cruelty-free. Our commitment to ethical beauty
                means we never test on animals, no exceptions.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-green-100">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-800">
                Eco-Friendly Products
              </h3>
              <p className="text-green-700">
                Our products are created with sustainable ingredients and
                eco-conscious packaging to minimize environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Skin Types
            </h2>
            <p className="text-xl text-green-700">
              Find the perfect products for your unique skin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {skinTypes.map((skin, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-green-100"
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${skin.color}`}
                >
                  {skin.type}
                </span>
                <p className="text-green-700 mb-2 font-medium">
                  {skin.description}
                </p>
                <p className="text-sm text-amber-700">{skin.advice}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-2xl p-8 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">
                  Consistency is Key
                </h4>
                <p className="text-green-700 text-sm">
                  A simple but regular routine is more effective than a complex
                  routine applied irregularly.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">
                  Patience and Perseverance
                </h4>
                <p className="text-green-700 text-sm">
                  Visible results typically appear after 4 to 6 weeks of regular
                  product use.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">
                  Listen to Your Skin
                </h4>
                <p className="text-green-700 text-sm">
                  Adapt your routine according to seasons, hormonal cycle, and
                  your skin's changing needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={categoriesSectionRef}
        id="categories"
        className="py-16 bg-green-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Our Categories
            </h2>
            <p className="text-xl text-green-700">
              Explore our full range of beauty products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-green-100"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-amber-800">
                    {category.name}
                  </h3>
                  <p className="text-green-700 mb-4 text-sm">
                    {category.description}
                  </p>
                  <button
                    onClick={() => navigate(category.path)}
                    className="text-amber-700 font-medium hover:text-amber-800 transition-colors"
                  >
                    Discover →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-green-700">
              Our Best Sellers & New Arrivals
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <span className="ml-3 text-green-700">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100"
                  // Add this to product card onClick:
                  onClick={() =>
                    navigate(`/product/${product.slug || product._id}`)
                  }
                >
                  <ProductImage product={product} />
                  <div className="p-4">
                    <h3 className="font-semibold text-amber-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-green-700 mb-3">
                      {product.category}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-amber-700">
                          {product.basePrice
                            ? product.basePrice.toFixed(2)
                            : "0.00"}{" "}
                          MAD
                        </span>
                      </div>

                      <div className="flex items-center border border-gray-300 rounded bg-white">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            updateProductQuantity(
                              product._id,
                              (productQuantities[product._id] || 1) - 1
                            );
                          }}
                          className="px-3 py-1 hover:bg-gray-100 font-semibold text-gray-600"
                          disabled={!product.inStock}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={productQuantities[product._id] || 1}
                          onChange={(e) => {
                            e.stopPropagation();
                            const value = parseInt(e.target.value) || 1;
                            updateProductQuantity(product._id, value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
                          disabled={!product.inStock}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            updateProductQuantity(
                              product._id,
                              (productQuantities[product._id] || 1) + 1
                            );
                          }}
                          className="px-3 py-1 hover:bg-gray-100 font-semibold text-gray-600"
                          disabled={!product.inStock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCartClick(product, e)}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        product.inStock
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={
                        !product.inStock || addingToCart.has(product._id)
                      }
                    >
                      {addingToCart.has(product._id)
                        ? "Adding..."
                        : product.inStock
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/shop")}
              className="bg-gradient-to-r from-amber-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto border border-green-200">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Our Product Guide
            </h2>
            <p className="text-xl text-green-700 mb-8">
              Discover comprehensive insights, detailed specifications, and
              expert recommendations in our complete product guide. Everything
              you need to make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-green-700">
                  Detailed product specifications
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-green-700">Expert recommendations</span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-amber-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105">
              Download PDF Guide
            </button>
          </div>
        </div>
      </section>

      {showVariantModal && (
        <VariantModal
          product={showVariantModal}
          onClose={() => setShowVariantModal(null)}
          onConfirm={addToCart}
        />
      )}

      <Footer />
    </div>
  );
};

export default Home;
