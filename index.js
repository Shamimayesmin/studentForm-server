const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


//middlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ui8slz3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try{
        console.log('databasedb connected');
        const studentCollection = client.db("studentDb").collection("information");

        //add students
		app.post("/information", async (req, res) => {
			const info = req.body;
			const result = await studentCollection.insertOne(info);
            console.log(result);
			res.send(result);
		});

        // load all student 
		app.get("/information", async (req, res) => {
			const query = {};
			const student = await studentCollection.find(query).toArray();
			res.send(student);
		});


        // delete manageStudent
        app.delete('/information/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await studentCollection.deleteOne(filter);
            res.send(result);
        })
        //get specific student to update
        app.get('/edit/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await studentCollection.findOne(query);
            res.send(result);
        })

        // update student  :
		app.put("/edit/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			console.log(req.body);
			const editName = req.body.updatedName;
			const editClass = req.body.updatedClass;
			const editDivision = req.body.updatedDivision;
			const editRoll = req.body.updatedRoll;
			const editAddress = req.body.updatedAddress;
			const editLand = req.body.updatedLand;
			const editCity = req.body.updatedCity;
			const editPin = req.body.updatedPin;
			const query = { _id: new ObjectId(id)};
			const option = {upsert : true}
			const updatedDoc = {
				$set: {
					firstName: editName,
                    class: editClass,
                    division:editDivision,
                    roll:editRoll,
                    addressone:editAddress,
                    landmark : editLand,
                    city:editCity,
                    pincode:editPin 
				},
			};
			const result = await studentCollection.updateOne(query, updatedDoc,option);
			res.send(result);
            console.log(result);
		});
        
    }
    finally{

    }
}

run().catch((err) => console.log(err))

app.get('/', (req,res) =>{
    res.send('student form server is running ...')
})

app.listen(port, () => {
    console.log(`Student server is runnign ...on${port}`);
})