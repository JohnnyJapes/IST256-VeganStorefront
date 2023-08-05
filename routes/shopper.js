const express = require('express')
const { MongoClient } = require("mongodb");
const router = require('express').Router()


const app = express()


let dbName = "team4"
const uri = "mongodb://team4:dbteam4_8X9@localhost:27017/team4"; // Replace with your MongoDB URI

//create
router.post('/register', async (req, res) => {
    try {
        console.log('JSON Payload: ', req.body);
        res.setHeader("Access-Control-Allow-Origin", "*");
        //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
        // Connect to the MongoDB server


        // Create a new MongoClient
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shoppers");

        // Example: Insert a document
        const document = req.body;

        const result = await collection.insertOne(document);
        console.log("Inserted document:", result.insertedId);
        res.status(200).send("Insertion Successful")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Insertion Error')
        // await client.close();
    } finally {
        // Close the connection
        await client.close();
        //console.log("Disconnected from MongoDB");
    }
})
// app.post('/register', async (req, res) => {
//     try {
//         console.log('JSON Payload: ', req.body);
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
//         // Connect to the MongoDB server
//         //await client.connect();

//         console.log("Connected to MongoDB");

//         // Perform operations on the database
//         const database = client.db(dbName);
//         const collection = database.collection("shoppers");

//         // Example: Insert a document
//         const document = req.body;

//         const result = await collection.insertOne(document);
//         console.log("Inserted document:", result.insertedId);
//         res.status(200).send("Insertion Successful")
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         res.status(500).send('Insertion Error')
//         // await client.close();
//     } finally {
//         // Close the connection
//         // await client.close();
//         //console.log("Disconnected from MongoDB");
//     }
// })


module.exports = router;