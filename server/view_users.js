const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-site');
    console.log("Connected to database...");

    const usersCollection = mongoose.connection.db.collection('usersAuthCred');
    const sellersCollection = mongoose.connection.db.collection('sellerAuthCred');

    const users = await usersCollection.find({}).toArray();
    const sellers = await sellersCollection.find({}).toArray();

    console.log("\n=== CUSTOMERS (usersAuthCred) ===");
    if (users.length === 0) console.log("No customers found.");
    users.forEach(u => {
        console.log(`- Name: ${u.name}, Email: ${u.email}, Password: ${u.password}`);
    });

    console.log("\n=== SELLERS (sellerAuthCred) ===");
    if (sellers.length === 0) console.log("No sellers found.");
    sellers.forEach(s => {
        console.log(`- Name: ${s.name}, Email: ${s.email}, Password: ${s.password}, Phone: ${s.phone}`);
    });

    await mongoose.disconnect();
}

main().catch(err => console.error(err));
