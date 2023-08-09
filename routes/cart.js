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

        const document = req.body;
        //make sure not duplicate product
        const match = await collection.findOne({ ID: document.ID });
        if (match) {
            await client.close();
            console.log("Disconnected from MongoDB");
            throw "Cart ID already in database";
        }
        //insert new
        const result = await collection.insertOne(document);
        console.log("Inserted document:", result.insertedId);
        res.status(200).send("Insertion Successful")
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        res.status(500).send('Insertion Error')


    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})

//Read
router.get('/cart/read', async (req, res) => {
    try {
        //console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");




        console.log("Get cart");




        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("cart");




        //Find document based on query


        const result = await collection.findOne({ owner: req.query.ID });
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
router.post('/cart/update', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("cart");




        // Example: Insert a document
        const document = {
            $set: req.body
        };


        const filter = { ID: req.body.ID }
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
router.post('/cart/delete', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("cart");




        // write query to variable
        const query = { ID: req.query.ID }


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
