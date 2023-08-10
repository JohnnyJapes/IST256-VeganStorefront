const express = require('express');
const req = require('express/lib/request');
const { MongoClient } = require("mongodb");
const router = require('express').Router()


const app = express()


let dbName = "team4"
const uri = "mongodb://team4:dbteam4_8X9@localhost:27017/team4"; // Replace with your MongoDB URI
const client = new MongoClient(uri);
//code goes here, replace app with router
//so router.post, router.get, etc.

//Create
router.post('/product/create', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("products");


        // Example: Insert a document
        const document = req.body;
        //make sure not duplicate product
        const match = await collection.findOne({ productID: document.productID });
        if (match) {
            throw "Product already in database";
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
router.get('/product/read', async (req, res) => {
    try {
        //console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        console.log("Get 1 product");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("products");


        //Find document based on query

        const result = await collection.findOne({ productID: parseInt(req.query.productID) });
        if (result) {
            console.log("Found document:", result._id);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(result)
        }
        else {
            res.status(404).send("Product Not Found")
        }

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Find Error')


    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})

//Read 10
router.get('/product/read10', async (req, res) => {
    try {
        //console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        console.log("Get products");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("products");


        // Example: Insert a document
        const document = req.body;
        //update document, otherwise insert new
        const result = await collection.find().limit(10)
        productArray = await result.toArray();
        console.log("Retrived Documents", productArray[0]);
        res.status(200).send(productArray)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Read Error')


    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})
//Update
router.post('/product/update', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("products");


        // Example: Insert a document
        const document = {
            $set: req.body
        };
        console.log(req.body.productID)

        const filter = { productID: req.body.productID }
        const options = {
            upsert: false,
            returnNewDocument: true
        }
        //update document, otherwise insert new
        const result = await collection.findOneAndUpdate(filter, document, options)
        console.log("Updated document");
        console.log(
            `${result.value._id} matched the filter, productID: ${result.value.productID}`,
        );
        res.status(200).send("Update Successful")
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
router.get('/product/delete', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("products");


        // write query to variable
        const query = { productID: parseInt(req.query.productID) }

        //delete query
        const result = await collection.deleteOne(query)
        console.log("Deleted document:", result);
        console.log(
            `${result.deletedCount} document(s) matched the filter`
        );
        if (result.deletedCount < 1)
            throw "No Product Found"
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