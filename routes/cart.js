const express = require('express')
const { MongoClient } = require("mongodb");
const router = require('express').Router()


const app = express()


let dbName = "team4"
const uri = "mongodb://team4:dbteam4_8X9@localhost:27017/team4";
const client = new MongoClient(uri);
//code goes here, replace app with router
//so router.post, router.get, etc.

//CREATE
router.post('/cart', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server

        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("carts");


        // Example: Insert a document
        const document = {
            $set: req.body
        };

        const filter = { owner: document.owner }
        const options = { upsert: true }
        //update document, otherwise insert new
        const result = await collection.updateOne(filter, document, options)
        console.log("Inserted document:", result.insertedId);
        res.status(200).send("Insertion Successful")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Insertion Error')


    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})

//READ


//UPDATE


//DELETE



module.exports = router;