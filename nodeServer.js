const express = require('express')
const { MongoClient } = require("mongodb");
const session = require('express-session');
const https = require("https");
const fs = require('fs');
const create = require('./routes/create.js')

var bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')
var cors = require("cors")
const shopper = require('./routes/shopper.js');
const product = require('./routes/product.js');
const returns = require('./routes/returns.js');
const cart = require('./routes/cart.js');


const app = express()
const port = 3004
const options = {
    key: fs.readFileSync('/data/ist411.key'),
    cert: fs.readFileSync('/data/ist411.cert')
};
let dbName = "team4"


// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json())
const corsOptions = {
    origin: 'https://my.up.ist.psu.edu',
    //credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
// Connection URI
const uri = "mongodb://team4:dbteam4_8X9@localhost:27017/team4"; // Replace with your MongoDB URI

// // Create a new MongoClient
// const client = new MongoClient(uri);
// client.connect();
// console.log("Connected to MongoDB");

app.get('/', (req, res) => {
    res.send("Secure https");
})
const server = https.createServer(options, app).listen(port, () => {
    console.log(`Example app listening at ${port}`)
});

//Session configuration
const sessionConfig = {
    name: 'userSession',
    secret: 'secretwordshouldbesupersecret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: uri,

        secret: 'secretwordshouldbesupersecret',
        touchAfter: 24 * 3600
    }),
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //calculation is for ms in a week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        //httpOnly: true,
        //secure: true
    }
}

//session setup
app.use(session(sessionConfig));


async function connectToMongoDB() {
    try {
        console.log('JSON Payload: ' + req.body);
        // Connect to the MongoDB server
        await client.connect();

        console.log("Connected to MongoDB");
        res.header("Access-Control-Allow-Origin", "*");
        // Perform operations on the database
        const database = client.db();
        const collection = database.collection("shoppers");

        // Example: Insert a document
        const document = req.body;
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

//connectToMongoDB();

app.use(shopper);
app.use(product);
app.use(cart);
app.use(returns);


// app.get('/', (req, res) => {
//     res.send('Hello express!')
// })

//Login
app.post('/login', async (req, res) => {
    try {
        console.log('JSON Payload: ', req.body);
        res.setHeader("Access-Control-Allow-Origin", "*");
        //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shoppers");

        // Example: Insert a document
        const document = req.body;

        const result = await collection.findOne({ email: document.email, password: document.password })

        console.log("Found document:", result._id.toString());
        res.status(200).send(result._id.toString())
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Insertion Error')
        // await client.close();
    } finally {
        // Close the connection
        // await client.close();
        //console.log("Disconnected from MongoDB");
    }
})
//Create Methods

//Create Shipping Address
// app.post('/shipping', async (req, res) => {
//     try {
//         console.log('JSON Payload: ' + req.body);
//         res.header("Access-Control-Allow-Origin", "*");
//         // Connect to the MongoDB server
//         // keeping one connection open for node server duration(look above)
//         //await client.connect();

//         console.log("Connected to MongoDB");

//         // Perform operations on the database
//         const database = client.db(dbName);
//         const collection = database.collection("shipping");

//         // Example: Insert a document
//         const document = req.body;

//         const result = await collection.insertOne(document);
//         console.log("Inserted document:", result.insertedId);
//         res.status(200).send("Insertion Successful")
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         res.status(500).send('Insertion Error')

//     }
// })
//Create billing
app.post('/billing', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("billing creation");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("billing");

        // Example: Insert a document
        const document = req.body;

        const result = await collection.insertOne(document);
        console.log("Inserted document:", result.insertedId);
        res.status(200).send("Insertion Successful")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Insertion Error')
        //await client.close();
    } finally {
        // Close the connection
        //await client.close();
        // console.log("Disconnected from MongoDB");
    }
})





//READ methods
app.get('/shipping', async (req, res) => {
    try {
        console.log('JSON Payload: ', req.query);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shipping");

        // Example: Insert a document
        const document = req.body;

        const result = await collection.findOne({ owner: req.query.session });
        console.log("Found document:", result._id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Search Error')
        // await client.close();
    } finally {
        // Close the connection
        // await client.close();
        //console.log("Disconnected from MongoDB");
    }
})
app.get('/billing', async (req, res) => {
    try {
        console.log('JSON Payload: ', req.query);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("billing");

        // Example: Insert a document
        const document = req.body;

        const result = await collection.findOne({ owner: req.query.session });
        console.log("Found document:", result._id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Search Error')
        // await client.close();
    } finally {
        // Close the connection
        // await client.close();
        //console.log("Disconnected from MongoDB");
    }
})
app.get('/product', async (req, res) => {
    try {
        //console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        // keeping one connection open for node server duration(look above)
        //await client.connect();


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
        res.status(500).send('Insertion Error')


    }
})
app.get('/cart', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        // keeping one connection open for node server duration(look above)
        //await client.connect();


        console.log("Connected to MongoDB");


        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("carts");


        const result = await collection.findOne({ owner: req.query.owner });
        console.log("Found document:", result._id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(productArray)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Insertion Error')


    }
})



//UPDATE METHODS

app.post('/userManagement', async (req, res) => {
    try {
        console.log('JSON Payload: ', req.body);
        res.setHeader("Access-Control-Allow-Origin", "*");
        //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db(dbName);
        const collection = database.collection("shoppers");

        const document = {
            $set: req.body
        };

        // Example: Update a document
        const filter = { email: document.email }
        const options = { upsert: true }
        //update document, otherwise insert new
        const result = await collection.updateOne(filter, document, options)
        console.log("Inserted document:", result.insertedId);
        res.status(200).send("Insertion Successful")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send('Insertion Error')
        // await client.close();
    } finally {
        // Close the connection
        // await client.close();
        //console.log("Disconnected from MongoDB");
    }
})