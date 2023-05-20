const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

// use middlewire
app.use(cors())
app.use(express.json())

/*************************************
MONGODB CODE 
*************************************/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.clipjzr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toyCollection = client.db("kidoi_toys").collection("toys");

        
        app.get("/toys", async(req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

/*************************************
MONGODB CODE END  
*************************************/


app.get('/', (req, res) => {
    res.send('Kidoi server is running!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})