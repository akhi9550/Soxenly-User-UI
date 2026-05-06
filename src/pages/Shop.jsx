import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Products with category filter
      const prodRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/products?count=100&category=${activeCategory}`);
      const prodData = await prodRes.json();
      if (prodRes.ok) setProducts(prodData.data || []);

      // Fetch Categories
      const catRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/category`);
      const catData = await catRes.json();
      if (catRes.ok) setCategories(catData.data || []);
    } catch (err) {
      console.error("Error fetching shop data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilterClass = (filterName) => {
    const base =
      "px-6 py-2.5 rounded-full text-[10px] font-display uppercase tracking-widest font-bold transition-all duration-300 border ";
    const nameToCompare = filterName || "";
    const isSelected = activeCategory.toLowerCase() === nameToCompare.toLowerCase();
    return isSelected
      ? base + "bg-soxenly-green text-soxenly-cream border-soxenly-green shadow-md"
      : base + "bg-white text-soxenly-charcoal/60 border-soxenly-beige hover:border-soxenly-green hover:text-soxenly-green";
  };

  const handleFilter = (filterName) => {
    if (filterName === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: filterName });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="bg-soxenly-cream min-h-screen">
      <div
        className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16"
        data-testid="shop-page"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div>
            <span className="text-xs font-display uppercase tracking-[0.3em] text-soxenly-leaf font-bold">
              /// Catalog
            </span>
            <h1 className="font-serif text-4xl lg:text-6xl text-soxenly-green mt-2">
              Conscious Collection
            </h1>
          </div>
          <div className="relative w-full lg:w-96">
            <input
              placeholder="Search collection..."
              className="w-full bg-white border border-soxenly-beige px-6 py-4 text-sm font-display focus:outline-none focus:border-soxenly-green transition-colors shadow-sm"
              data-testid="shop-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soxenly-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-3 mb-12"
          data-testid="category-filters"
        >
          <button
            onClick={() => handleFilter("all")}
            className={getFilterClass("all")}
          >
            All essentials
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.category)}
              className={getFilterClass(cat.category)}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border border-soxenly-beige border-t-soxenly-green rounded-full animate-spin"></div>
             <span className="font-display text-[10px] uppercase tracking-widest text-soxenly-green font-bold">Refining Inventory...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                className="group block"
                to={`/product/${product.id}`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-white mb-6 relative shadow-sm group-hover:shadow-md transition-all duration-500">
                  {product.image && product.image.length > 0 ? (
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={product.image[0].startsWith("http") ? product.image[0] : `${import.meta.env.VITE_API_BASE_URL}${product.image[0]}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-display text-neutral-400 uppercase tracking-widest">
                      Natural Blend
                    </div>
                  )}
                  {product.product_status === "out of stock" && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-soxenly-green text-soxenly-cream px-6 py-2 text-[10px] font-display uppercase tracking-[0.2em] font-bold shadow-lg">
                        Sold Out
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                   <h3 className="font-display text-base uppercase tracking-wider text-soxenly-charcoal group-hover:text-soxenly-leaf transition-colors">
                     {product.name}
                   </h3>
                   <p className="text-[11px] font-display uppercase tracking-widest text-soxenly-charcoal/40 font-medium">
                     {product.category_name}
                   </p>
                   <div className="flex items-center gap-2">
                    <p className="text-xl font-bold tracking-tight text-soxenly-green tabular-nums">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-96 border border-dashed border-soxenly-beige flex items-center justify-center bg-white shadow-inner">
            <span className="font-display text-xs text-soxenly-charcoal/40 uppercase tracking-widest">No conscious choices found matching your search.</span>
          </div>
        )}
      </div>
    </div>
  );
}

