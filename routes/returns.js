const express = require('express')
const { MongoClient } = require("mongodb");
const router = require('express').Router()


const app = express()


let dbName = "team4"
const uri = "mongodb://team4:dbteam4_8X9@localhost:27017/team4"; // Replace with your MongoDB URI
const client = new MongoClient(uri);
//code goes here, replace app with router
//so router.post, router.get, etc.

//create
router.post('/returns', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("returns");


        // Example: Insert a document
        const document = req.body;
        const match = await collection.findOne({ orderNumber: document.orderNumber });
        if (match) {
            throw "Return already in database";
        }

        const result = await collection.insertOne(document);
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
//Read
router.get('/returns/read', async (req, res) => {
    try {
        //console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");

        console.log("Get return");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("returns");

        //Find document based on query

        const result = await collection.findOne({ orderNumber: parseInt(req.query.orderNumber) });
        console.log("Found document:", result._id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Find Error')




    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})



//Update
router.post('/returns/update', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("returns");




        // Example: Insert a document
        const document = {
            $set: req.body
        };


        const filter = { orderNumber: document.orderNumber }
        const options = { upsert: false }
        //update document, otherwise insert new
        const result = await collection.updateOne(filter, document, options)
        console.log("Inserted document:", result.insertedId);
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
        res.status(200).send("Insertion Successful")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Update Error')




    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})


//Delete
router.get('/cart/delete', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("returns");




        // write query to variable
        const query = { orderNumber: parseInt(req.query.orderNumber) }


        //delete query
        const result = await collection.deleteOne(query)
        console.log("Inserted document:", result.insertedId);
        console.log(
            `${result.matchedCount} document(s) matched the filter, deleted ${result.modifiedCount} document(s)`,
        );
        res.status(200).send("Deletion Successful")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Update Error')




    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})
module.exports = router;



module.exports = router;
