require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
// From .env file
const PORT = process.env.PORT;
const URI = process.env.URI;

app.use(express.json());
//For logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

mongoose
    .connect(URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        set: (name) => name.trim(),
    },
    synonym: {
        type: [String],
        required: true,
        validate: {
            validator: async function (synonyms) {
                const lowercaseSynonyms = synonyms.map((s) =>
                    s.trim().toLowerCase()
                );
                const hasDuplicates =
                    new Set(lowercaseSynonyms).size !==
                    lowercaseSynonyms.length;
                if (hasDuplicates) return false;

                const existingProducts = await mongoose.model("Product").find({
                    synonym: { $in: lowercaseSynonyms },
                });
                return existingProducts.length === 0;
            },
            message: "Each synonym must be unique across all products",
        },
        set: (synonyms) => synonyms.map((s) => s.trim().toLowerCase()),
    },
});

const Product = mongoose.model("Product", productSchema);

// Test route to verify server is working
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Route to add a new product or update synonyms
app.post("/products/addNew", async (req, res) => {
    try {
        const { name, synonym } = req.body;

        if (!name || !Array.isArray(synonym) || synonym.length === 0) {
            return res
                .status(400)
                .json({ error: "Name and at least one synonym are required" });
        }

        const trimmedName = name.trim().toLowerCase();
        const trimmedSynonyms = synonym.map((s) => s.trim().toLowerCase());

        const existingAsSynonym = await Product.findOne({
            synonym: trimmedName,
        });
        if (existingAsSynonym) {
            return res.status(400).json({
                error: `The name "${name}" already exists as a synonym for another product.`,
            });
        }

        const synonymExistsAsName = await Product.findOne({
            name: { $in: trimmedSynonyms },
        });
        if (synonymExistsAsName) {
            return res.status(400).json({
                error: `One of the synonyms (${synonym.join(
                    ", "
                )}) already exists as a product name.`,
            });
        }

        let product = await Product.findOne({ name: trimmedName });

        if (product) {
            const updatedSynonyms = [
                ...new Set([...product.synonym, ...trimmedSynonyms]),
            ].filter((s) => s !== trimmedName);

            product.synonym = updatedSynonyms;
            const updatedProduct = await product.save();
            return res.status(200).json({
                message: "Product updated successfully with new synonyms",
                product: updatedProduct,
            });
        }

        const newProduct = new Product({
            name: trimmedName,
            synonym: trimmedSynonyms.filter((s) => s !== trimmedName),
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product added successfully",
            product: savedProduct,
        });
    } catch (error) {
        console.error("Error adding product:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                error: "Product with the same name already exists",
            });
        }

        res.status(500).json({
            error: error.message || "Internal Server Error",
        });
    }
});

// Route to get all products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            message: "Products retrieved successfully",
            products: products,
        });
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete a product by name
app.delete("/products/delete/:name", async (req, res) => {
    try {
        const name = req.params.name.trim().toLowerCase();
        const deletedProduct = await Product.findOneAndDelete({ name });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Helper function to check if two strings are equal regardless of word order
function areStringsEqual(str1, str2) {
    const normalize = (str) => str.split(" ").sort().join(" ").toLowerCase();
    return normalize(str1) === normalize(str2);
}

// Route to check if input matches a product name or synonym
app.get("/products/check/:value", async (req, res) => {
    try {
        const value = req.params.value.trim().toLowerCase();
        let product = await Product.findOne({ name: value });

        if (!product) {
            const products = await Product.find();
            for (let p of products) {
                const matchingSynonym = p.synonym.find((synonym) =>
                    areStringsEqual(synonym, value)
                );

                if (matchingSynonym) {
                    product = p;
                    break;
                }
            }
        }

        if (!product) {
            return res
                .status(404)
                .json({ message: "No matching product found" });
        }

        if (product.name === value) {
            return res.status(200).json({
                message: "Product found",
                productName: product.name,
            });
        }

        return res.status(200).json({
            message: "Synonym found",
            productName: product.name,
        });
    } catch (error) {
        console.error("Error checking product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
