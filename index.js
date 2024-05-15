const express =require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 3000

//04TAHphEohqMujhp
//luxstay

const app =express()
const corsOptions ={
    origin:['http://localhost:5174','http://localhost:5173'],
    credentials:true,
    optionSuccessStatus:200
}


app.use(cors(corsOptions))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0wrhevo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      const roomscollection=client.db('luxstay').collection('room')
      const bookcollection=client.db('luxstay').collection('book')

      //get all rooms data from database
      app.get('/rooms',async(req,res)=>{
        const result = await roomscollection.find().toArray()
        res.send(result)

      })

      //get single room data
      app.get('/room/:id',async(req,res)=>{
        const id =req.params.id
        const query ={_id:new ObjectId(id)}
        const result=await roomscollection.findOne(query)
        res.send(result)
      })

      //save book data in database
      app.post('/book',async(req,res)=>{
        const bookData =req.body
        const result =await bookcollection.insertOne(bookData)
        res.send(result)
      })
      

      //get all book room booked by user
      app.get('/mybook/:email',async(req,res)=>{
        const email =req.params.email

        const result = await bookcollection.find({email:req.params.email}).toArray()
        res.send(result)

      })
      //cancel book room booked by user
      app.delete('/mybook/:id',async(req,res)=>{
        const id =req.params.id
        const query ={_id:new ObjectId(id)}

        const result = await bookcollection.deleteOne(query)
        res.send(result)

      })

      //update  room in database
      app.put('/mybook/:id',async(req,res)=>{
        const id =req.params.id
        const roomData = req.body
        const query ={_id:new ObjectId(id)}
        const options ={upsert:true}
        const updateDoc ={
            $set:{
                ...roomData
            },
        }
         const result = await bookcollection.updateOne(query,updateDoc,options)
         res.send(result)

       

      })


     
      
      
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      
   
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Hello from luxstay')
})



app.listen(port,()=>console.log(`server is running on port ${port}`))