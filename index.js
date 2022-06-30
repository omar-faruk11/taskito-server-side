const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.razje.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);
const run = async () => {
    try{
        await client.connect();
        const taskCollection = client.db('Taskito').collection('Task');
        console.log('mongodb connected');

        //get all task 
        app.get('/taskes', async(req,res)=>{
            const taskes = taskCollection.find({}).toArray();
            res.send(taskes);
        });
        
       

    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome Taslito')
})

app.listen(port, () => {
    console.log(`taskito listening on port ${port}`)
})