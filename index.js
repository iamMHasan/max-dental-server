const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('max dental is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cxnxmvd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('MaxDental').collection('servicesName')
        const service_Collection = client.db('MaxDental').collection('services')
        const reviewCollection = client.db('MaxDental').collection('review')
        // servicename to show on home page
        app.get('/servicesName', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)

            const result = await cursor.limit(3).toArray()
            res.send(result)
        })
        // all services category api
        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = service_Collection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // specific service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id : ObjectId(id)}

            const result = await service_Collection.findOne(query)
            res.send(result)
        })
        // get review 
        app.post('/review', async(req, res)=>{
            const review = req.body 
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))




app.listen(port, () => console.log("app is running.."))