const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken')
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
        const addedServiceCollection = client.db('MaxDental').collection('addservice')
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
        // get review specifice
        app.delete('/review/:id', async(req, res)=>{
            const id = req.params.id 
            
            const query = {_id : ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
        // get review 
        app.post('/review', async(req, res)=>{
            const review = req.body 
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })
        // get review
        app.get('/review', async(req, res)=>{
            let query = {}
            if(req.query.name){
                query = {
                    serviceName :  req.query.name
                }
            }
            if(req.query.email){
                query ={
                    email : req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })
        // add service by user
        app.post('/addservice', async(req, res)=>{
            const service = req.body
            const result = await addedServiceCollection.insertOne(service)
            res.send(result)
        })
        // get add services
        app.get('/addservice', async(req, res)=>{
            let query = {}
            if(req.query.email){
                query={
                    email : req.query.email
                }
            }
            const cursor = addedServiceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // jwt token
        app.post('/jwt', async(req, res)=>{
            const userMail = req.body 
            
            const token = jwt.sign(userMail,process.env.ACCESS_TOKEN,{expiresIn : '1h'})
            res.send({token})
        })
       
    }
    finally {

    }
}
run().catch(err => console.log(err))




app.listen(port, () => console.log("app is running.."))