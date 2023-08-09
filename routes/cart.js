const express = require('express');
const { MongoClient } = require("mongodb");
const router = express.Router();

let dbName = "team4";
const uri = "mongodb://team4:dbteam4_8X9@localhost:27017/team4";
const client = new MongoClient(uri);

// CREATE
router.post('/cart', async (req, res) => {
    try {
        console.log("cart create")
        res.header("Access-Control-Allow-Origin", "*");
        const cartDocument = req.body;
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection("carts");
        const match = await collection.findOne({ cartID: cartDocument.cartID });
        if (match) throw "Cart ID already in database";
        const result = await collection.insertOne(cartDocument);
        console.log("Inserted document:", result.insertedId);
        res.status(200).send("Insertion Successful");
    } catch (error) {
        console.log(error)
        res.status(500).send('Insertion Error');

    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
});

// READ
router.get('/cart/read', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection("carts");
        const result = await collection.findOne({ cartID: parseInt(req.query.cartID) });
        if (result) {
            console.log("Found document:", result._id);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(result)
        } else {
            console.log("Cart not found")
            res.status(404).send("Cart Not Found")
        }
    } catch (error) {
        console.log("Error: " + error)
        res.status(500).send('Find Error');
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
});

// UPDATE
router.post('/cart/update', async (req, res) => {
    try {
        console.log('cart update')
        res.header("Access-Control-Allow-Origin", "*");
        const updateFields = { $set: req.body };
        const filter = { cartID: req.body.cartID };
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection("carts");
        const result = await collection.updateOne(filter, updateFields);
        res.status(200).send("Update Successful");
    } catch (error) {
        console.log(error)
        res.status(500).send('Update Error');
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
});

// DELETE
router.get('/cart/delete', async (req, res) => {
    try {
        console.log("cart delete")
        res.header("Access-Control-Allow-Origin", "*");
        const query = { cartID: parseInt(req.query.cartID) };
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection("carts");
        const result = await collection.deleteOne(query);
        res.status(200).send("Deletion Successful");
    } catch (error) {
        console.log(error)
        res.status(500).send('Deletion Error');
    } finally {
        await client.close();
    }
});

module.exports = router;
