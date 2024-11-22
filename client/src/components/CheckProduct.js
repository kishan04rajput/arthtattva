import React, { useState } from "react";
import axios from "axios";
import AddProduct from "./AddProduct";

const CheckProduct = () => {
    const [value, setValue] = useState("");
    const [message, setMessage] = useState("");
    const [showAddProduct, setShowAddProduct] = useState(false);

    const handleCheck = async () => {
        if (!value.trim()) {
            setMessage("Please enter a product name or synonym.");
            return;
        }
        try {
            const response = await axios.get(`/products/check/${value}`);
            if (response.status === 200) {
                setMessage(
                    response.data.message + ": " + response.data.productName
                );
                setShowAddProduct(false);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setMessage("No matching product found. Please add it.");
                setShowAddProduct(true);
            } else {
                setMessage(
                    error.response?.data?.message || "Error checking product"
                );
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
                Check Product
            </h2>
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter product name or synonym"
                    className="w-full p-3 bg-gray-100 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleCheck}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg border-2 border-blue-500 hover:bg-blue-700 focus:outline-none"
                >
                    Check
                </button>
            </div>
            {message && <p className="text-center text-gray-700">{message}</p>}
            {showAddProduct && <AddProduct />}
        </div>
    );
};

export default CheckProduct;
