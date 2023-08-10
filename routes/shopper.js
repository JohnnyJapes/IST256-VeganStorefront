const express = require('express')
const { MongoClient } = require("mongodb");
const router = require('express').Router()


const app = express()


let dbName = "team4"
const uri = "mongodb://team4:dbteam4_8X9@localhost:27017/team4"; // Replace with your MongoDB URI
const client = new MongoClient(uri);

//create
router.post('/register', async (req, res) => {
    try {
        console.log('JSON Payload: ', req.body);
        res.setHeader("Access-Control-Allow-Origin", "*");
        //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
        // Connect to the MongoDB server


        // Create a new MongoClient

        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shoppers");


        // Example: Insert a document
        const document = req.body;

        //make sure not duplicate User
        const match = await collection.findOne({ email: document.email });
        if (match) {
            throw "Email already in database";
        }

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
        console.log("Disconnected from MongoDB");
    }
})
//Read
router.get('/shopper/read', async (req, res) => {
    try {
        //console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");

        console.log("Get email");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shoppers");




        //Find document based on query


        const result = await collection.findOne({ email: req.query.email });
        if (result) {
            console.log("Found document:", result._id);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(result)
        }
        else {
            res.status(404).send("Shopper Not Found")
        }
    } catch (error) {
        console.error("Error During Find process: ", error);
        res.status(500).send('Find Error')




    } finally {
        // Close the connection
        await client.close();
        console.log("Disconnected from MongoDB");
    }
})


//Update
router.post('/shopper/update', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shoppers");

        // Example: Insert a document
        const document = {
            $set: req.body
        };


        const filter = { email: req.body.email }
        const options = { upsert: false, returnNewDocument: true }
        //update document, otherwise insert new
        const result = await collection.findOneAndUpdate(filter, document, options)
        console.log("Updated document");
        console.log(
            `${result.value._id} matched the filter, Email: ${result.value.email}`,
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
router.get('/shopper/delete', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        await client.connect();
        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shoppers");

        // write query to variable
        const query = { email: req.query.email }


        //delete query
        const result = await collection.deleteOne(query)
        console.log("Deleted document:", result);
        console.log(
            `${result.deletedCount} document(s) matched the filter`
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
