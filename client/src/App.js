import React from "react";
import CheckProduct from "./components/CheckProduct";
import ProductList from "./components/ProductList";
import DeleteProduct from "./components/DeleteProduct";

function App() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Product Management
                </h1>
                <div className="space-y-6">
                    <CheckProduct />
                    <ProductList />
                    <DeleteProduct />
                </div>
            </div>
        </div>
    );
}

export default App;
