const express = require('express')
const { MongoClient } = require("mongodb");
const app = express()
const port = 3004




// Connection URI
const uri = "mongodb://localhost:27017/VeganStore"; // Replace with your MongoDB URI

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        // Connect to the MongoDB server
        await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db();
        const collection = database.collection("shoppers");

        // Example: Insert a document
        const document = { name: "John", age: 30 };
        const result = await collection.insertOne(document);
        console.log("Inserted document:", result.insertedId);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
}

connectToMongoDB();




app.get('/', (req, res) => {
    res.send('Hello express!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})