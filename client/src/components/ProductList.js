import React, { useState } from "react";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [showProducts, setShowProducts] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/products");
            setProducts(response.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleToggle = async () => {
        setShowProducts(!showProducts);
        if (!showProducts) {
            await fetchProducts();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
                Product List
            </h2>
            <div className="flex justify-center">
                <button
                    onClick={handleToggle}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg border-2 border-blue-500 hover:bg-blue-700 focus:outline-none"
                >
                    {showProducts ? "Hide Products" : "Show Products"}
                </button>
            </div>
            {showProducts && (
                <ul className="mt-4 space-y-2">
                    {products.map((product) => (
                        <li
                            key={product._id}
                            className="p-3 bg-gray-100 rounded-lg border-2 border-gray-300"
                        >
                            <span className="font-medium text-blue-700">
                                {product.name}
                            </span>{" "}
                            (Synonyms:{" "}
                            <span className="text-gray-700">
                                {product.synonym.join(", ")}
                            </span>
                            )
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductList;
