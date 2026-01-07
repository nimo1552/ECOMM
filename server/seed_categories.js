const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    subcategories: [String],
    image: String
}, { collection: 'category' });

const categories = [
    {
        name: "Electronics",
        subcategories: ["Mobiles", "Laptops", "Cameras", "Accessories"],
        image: "electronics.jpg"
    },
    {
        name: "Fashion",
        subcategories: ["Men", "Women", "Kids", "Watches"],
        image: "fashion.jpg"
    },
    {
        name: "Home",
        subcategories: ["Furniture", "Decor", "Kitchen", "Lighting"],
        image: "home.jpg"
    },
    {
        name: "Toys",
        subcategories: ["Action Figures", "Board Games", "Dolls", "Puzzles"],
        image: "toys.jpg"
    }
];

async function seed() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-site');
    console.log("Connected to database...");

    const CategoryModel = mongoose.model('category', categorySchema);

    // Clear existing
    await CategoryModel.deleteMany({});
    console.log("Cleared existing categories.");

    // Insert new
    await CategoryModel.insertMany(categories);
    console.log("Inserted default categories.");

    await mongoose.disconnect();
    console.log("Done.");
}

seed().catch(err => console.error(err));
