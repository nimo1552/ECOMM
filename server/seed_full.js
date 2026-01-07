const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect explicitly
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-site')
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });

// Helper to transform EJSON (Extended JSON)
function transform(obj) {
    if (Array.isArray(obj)) {
        return obj.map(transform);
    } else if (obj !== null && typeof obj === 'object') {
        if (obj.$oid) return new mongoose.Types.ObjectId(obj.$oid);
        if (obj.$date) return new Date(obj.$date);
        
        const newObj = {};
        for (const key in obj) {
            newObj[key] = transform(obj[key]);
        }
        return newObj;
    }
    return obj;
}

const mappings = [
    { file: 'ecommerce-site.cartData.json', collection: 'cartData' },
    { file: 'ecommerce-site.category.json', collection: 'category' },
    { file: 'ecommerce-site.orders.json', collection: 'orders' },
    { file: 'ecommerce-site.products.json', collection: 'products' },
    { file: 'ecommerce-site.sellerAuthCred.json', collection: 'sellerAuthCred' },
    { file: 'ecommerce-site.usersAuthCred.json', collection: 'usersAuthCred' }
];

async function seed() {
    try {
        for (const map of mappings) {
            const filePath = path.join(__dirname, '..', 'DATABASE DATA', map.file);
            if (fs.existsSync(filePath)) {
                console.log(`Reading ${map.file}...`);
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);
                const transformedData = transform(data);
                
                if (transformedData.length > 0) {
                    await mongoose.connection.collection(map.collection).deleteMany({});
                    await mongoose.connection.collection(map.collection).insertMany(transformedData);
                    console.log(`Restored ${map.collection} (${transformedData.length} records)`);
                } else {
                    console.log(`Skipping ${map.collection} (no data)`);
                }
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        }
        console.log("Database restoration complete.");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
}

mongoose.connection.once('connected', seed);
