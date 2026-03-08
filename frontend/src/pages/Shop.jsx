import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Shop = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContent);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [productQuantities, setProductQuantities] = useState({});

  const categories = [
    "All",
    "Hydrolate",
    "Argan Products",
    "Oils",
    "Para Pharma",
    "Skin Care",
  ];

  useEffect(() => {
    fetchProducts();
  }, [backendUrl, selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    if (token) {
      fetchWishlistItems();
    }
  }, [token, backendUrl]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${backendUrl}api/products?limit=100`;
      if (selectedCategory && selectedCategory !== "All") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.products) {
          let sortedProducts = [...data.products];

          switch (sortBy) {
            case "price-low":
              sortedProducts.sort((a, b) => a.basePrice - b.basePrice);
              break;
            case "price-high":
              sortedProducts.sort((a, b) => b.basePrice - a.basePrice);
              break;
            case "name":
              sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
              break;
            default:
              break;
          }

          setProducts(sortedProducts);
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
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const updateProductQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/product/${product.slug || product._id}`);
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

  const ProductImage = ({ product }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const localImagePath = getLocalImagePath(product.mainImage);

    return (
      <div className="relative w-full h-64">
        {!imageLoaded && !imageError && (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        )}

        <img
          src={
            localImagePath ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+"
          }
          alt={product.name}
          className={`w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity ${
            !imageLoaded ? "hidden" : ""
          }`}
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Shop</h1>
          <p className="text-green-700 text-lg">
            Discover our complete collection of premium beauty products
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category === "All" ? "" : category)
                }
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  (category === "All" && !selectedCategory) ||
                  selectedCategory === category
                    ? "bg-gradient-to-r from-amber-600 to-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-amber-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-green-700">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchProducts}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() =>
                  navigate(`/product/${product.slug || product._id}`)
                }
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-green-100"
              >
                <ProductImage product={product} />
                <div className="p-4">
                  <h3 className="font-semibold text-amber-900 mb-2 line-clamp-2 h-12">
                    {product.name}
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    {product.category}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-amber-700">
                      {product.basePrice
                        ? product.basePrice.toFixed(2)
                        : "0.00"}{" "}
                      MAD
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      product.inStock
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "View Details" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
