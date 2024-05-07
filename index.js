const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
require("dotenv").config();
const port = process.env.PORT | 8080;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@touring.uoxy8h0.mongodb.net/?retryWrites=true&w=majority&appName=touring`;

app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}));
app.use(express.json());
app.use(cookieParser())

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
      const data = req.body;
      console.log(data);
      const token = jwt.sign(data, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      res
        .cookie("access token", token, {
          httpOnly: true,
          secure: false,
          // sameSite: false,
        })
        .send({ success: true });
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
      console.log('access token',req.cookies["access token"])
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
