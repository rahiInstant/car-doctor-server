const key = process.env;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken')
const app = express();
const { mongoMini } = require("./another");
require("dotenv").config();
const port = key.PORT | 8080;
const uri = mongoMini(key.DB_USER, key.DB_PASS, "touring", "uoxy8h0");

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

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log(user);
      jwt.sign(user)

      res.send(user);
    });

    const carDB = client.db("CarInfo");
    const serviceCollection = carDB.collection("service");
    const userCollection = carDB.collection("user");
    const orderCollection = carDB.collection("order");

    app.get("/service", async (req, res) => {
      const query = {};
      const option = { projection: { title: 1, img: 1, price: 1 } };
      const cursor = serviceCollection.find(query, option);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/particular/:id", async (req, res) => {
      const Id = req.params.id;
      const query = { _id: new ObjectId(Id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.post("/check-out", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/user-order", async (req, res) => {
      // const query = req.query
      // console.log("access token==", req.cookies["access token"]);
      // console.log(req.user);
      // console.log(req.query.email,req.user.email)
      // if (req.query.email !== req.user.email) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }

      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/update-status", async (req, res) => {
      const query = { _id: new ObjectId(req.query.id) };

      const updateDoc = {
        $set: {
          status: req.body.status,
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send({ ...result, status: req.body.status });
    });

    app.delete("/user-order", async (req, res) => {
      const query = { _id: new ObjectId(req.query.id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

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
