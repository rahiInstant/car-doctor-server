const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT | 8080;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@touring.uoxy8h0.mongodb.net/?retryWrites=true&w=majority&appName=touring`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const carDB = client.db("CarInfo");
    const serviceCollection = carDB.collection("service");
    const userCollection = carDB.collection("user");
    
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to car-doctor server.");
});

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
