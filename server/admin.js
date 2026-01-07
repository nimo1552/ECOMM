const express = require("express");
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// Database Connection
async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-site');
        console.log("Admin Server connected to database");
    } catch (err) {
        console.error("Admin Server DB Connection Error:", err);
    }
}
connectDB();

// Dashboard Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Generic Data API
app.get("/api/admin/data/:collection", async (req, res) => {
    const collectionName = req.params.collection;
    try {
        const collection = mongoose.connection.db.collection(collectionName);
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching collection data" });
    }
});

// Update API
app.put("/api/admin/update/:collection/:id", async (req, res) => {
    const collectionName = req.params.collection;
    const id = req.params.id;
    const updateData = req.body;

    try {
        const collection = mongoose.connection.db.collection(collectionName);
        delete updateData._id; // Prevent updating the immutable _id

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating document" });
    }
});

// Delete API
app.delete("/api/admin/delete/:collection/:id", async (req, res) => {
    const collectionName = req.params.collection;
    const id = req.params.id;

    try {
        const collection = mongoose.connection.db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting document" });
    }
});

app.listen(port, () => {
    console.log(`Admin Dashboard running on http://localhost:${port}`);
});
