const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.razje.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try{
        await client.connect();
        const taskCollection = client.db('Taskito').collection('Task');
        console.log('mongodb connected');

        //get all incomplete task 
        app.get('/taskes', async(req,res)=>{
            const taskes = await taskCollection.find({ status: "incomplete" }).toArray();
            res.send(taskes);
        });
        // get task by id
        app.get('/task/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(filter);
            res.send(result);
        })
        //get all competed task
        app.get('/competed/tasks', async(req, res)=>{
            const completedtaskes = await taskCollection.find({ status: "completed" }).toArray();
            res.send(completedtaskes);
        });

        // Add a new task
        app.post('/new/task', async(req, res)=>{
            const newtask = req.body;
            console.log(newtask);
            const result = await taskCollection.insertOne(newtask);
            res.send(result);
        });

        // Update task  
        app.patch('/update/task/:id', async(req, res)=>{
            const id = req.params.id;
            const task = req.body.newtask;
            console.log(id, task);
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    task
                }
            };
            const result = await taskCollection.updateOne(filter,updateDoc);
            res.send(result)
        });


        // update status of task
        app.patch('/update/status/:id', async(req, res)=>{
            const id = req.params.id;
            const taskStatus = req.body.status;
            console.log(id, taskStatus);
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: taskStatus,
                }
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

    }
    finally{

    };
};
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome Taslito')
});

app.listen(port, () => {
    console.log(`taskito listening on port ${port}`)
});