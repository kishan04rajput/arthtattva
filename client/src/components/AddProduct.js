import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [synonym, setSynonym] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/products/addNew", {
                name,
                synonym: synonym.split(",").map((s) => s.trim()),
            });
            setMessage(response.data.message);
            setName("");
            setSynonym("");
        } catch (error) {
            setMessage(error.response?.data?.error || "Error adding product");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
                Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-medium">Product Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="p-3 bg-gray-100 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">
                        Synonyms (comma-separated):
                    </label>
                    <input
                        type="text"
                        value={synonym}
                        onChange={(e) => setSynonym(e.target.value)}
                        required
                        className="p-3 bg-gray-100 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg border-2 border-blue-500 hover:bg-blue-700 focus:outline-none"
                >
                    Add Product
                </button>
            </form>
            {message && <p className="text-center text-gray-700">{message}</p>}
        </div>
    );
};

export default AddProduct;
