import React, { useState } from "react";
import axios from "axios";

const DeleteProduct = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const handleDelete = async () => {
        if (!name.trim()) {
            setMessage("Please enter a product name.");
            return;
        }
        try {
            const response = await axios.delete(`/products/delete/${name}`);
            setMessage(response.data.message);
            setName(""); // Clear input field after deletion
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Error deleting product"
            );
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
                Delete Product
            </h2>
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    className="p-3 bg-gray-100 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-red-500"
                />
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg border-2 border-red-500 hover:bg-red-700 focus:outline-none"
                >
                    Delete
                </button>
            </div>
            {message && (
                <p
                    className={`text-center mt-4 ${
                        message.includes("Error")
                            ? "text-red-500"
                            : "text-green-500"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default DeleteProduct;
