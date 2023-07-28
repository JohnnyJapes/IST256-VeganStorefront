const express = require('express')
const { MongoClient } = require("mongodb");
const session = require('express-session');

var bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')
var cors = require("cors")


const app = express()
const port = 3004

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json())
const corsOptions = {
    origin: 'http://127.0.0.1:8000',
    //credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
// Connection URI
const uri = "mongodb://localhost:27017/VeganStore"; // Replace with your MongoDB URI

// Create a new MongoClient
const client = new MongoClient(uri);
client.connect();

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
        // const document = {

        //     "email": emailInput.val(),
        //     "password": pw.val(),
        //     "name": fNameInput.val() + " " + lNameInput.val(),
        //     "age": ageInput.val(),
        //     "address": addressInput.val(),
        //     "phone": phoneInput.val()
        // };
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
        const database = client.db();
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
//CreateShopper
app.post('/register', async (req, res) => {
    try {
        console.log('JSON Payload: ', req.body);
        res.setHeader("Access-Control-Allow-Origin", "*");
        //res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db();
        const collection = database.collection("shoppers");

        // Example: Insert a document
        const document = req.body;
        // const document = {

        //     "email": req.body.email,
        //     "password": req.body.password,
        //     "name": req.body.name,
        //     "age": req.body.age,
        //     "address": req.body.address,
        //     "phone": req.body.phone
        // };
        const result = await collection.insertOne(document);
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
//Create Shipping Address
app.post('/shipping', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db();
        const collection = database.collection("shipping");

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
        // await client.close();
        //console.log("Disconnected from MongoDB");
    }
})
//Create billing
app.post('/billing', async (req, res) => {
    try {
        console.log('JSON Payload: ' + req.body);
        res.header("Access-Control-Allow-Origin", "*");
        // Connect to the MongoDB server
        //await client.connect();

        console.log("Connected to MongoDB");

        // Perform operations on the database
        const database = client.db();
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
        const database = client.db();
        const collection = database.collection("shipping");

        // Example: Insert a document
        const document = req.body;

        const result = await collection.findOne({ owner: req.query.session });
        console.log("Found document:", result._id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result)
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