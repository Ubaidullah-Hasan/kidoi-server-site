const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

// use middlewire
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
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
        
        app.post("/toys", async(req, res) => {
            const addToy = req.body;
            console.log(addToy)
            const result = await toyCollection.insertOne(addToy);
            res.send(result);
        })


        app.get("/toys", async(req, res) => {
            const toys = parseInt(req.query.limit) || 20;
            const searchQuery = req.query.search || "";
            const query = {
                name: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search
            };
            const cursor = toyCollection.find(query).limit(toys);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/toysUser", async(req, res) => {
            const email = req.query.email;
            console.log(email)
            let query = {}
            if(req.query?.email){
                query = {email: email}
            }
            const lowToHigePrice = { price: 1};
            const result = await toyCollection.find(query).sort(lowToHigePrice).toArray()
            res.send(result);
        })

        app.get("/toys/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        app.put("/toys/:id", async(req, res)=> {
            const id = req.params.id;
            const update = req.body;
            console.log(id, update);
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true}
            const updatedToy = {
                $set:{
                    price: update.price,
                    quantity: update.quantity,
                    details: update.description
                }
            }
            const result = await toyCollection.updateOne(filter, updatedToy, options)
            res.send(result)
        })

        app.delete("/toys/:id", async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.deleteOne(query);
            res.send(result)
        })

        // toy filter by category
        app.get("/toy", async(req, res) => {
            const category = (req.query.category);
            console.log(category)
            // const query = { subCategory: new ObjectId(category)}
            const query = {
                subCategory: { $regex: category, $options: 'i' }, // Case-insensitive search
            };
            const cursor = toyCollection.find(query).limit(3);
            const result = await cursor.toArray();
            res.send(result);
        }) 


        app.get("/totalToys", async(req, res) => {
            const result = await toyCollection.estimatedDocumentCount();
            res.send({totalToy: result});
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