const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.d9lmwal.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("brandDB").collection("brand");

    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    app.get("/brand/:brandName", async (req, res) => {
      const brands = req.params.brandName;
      const query = { brandName: brands };
      const result = await brandCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/brand", async (req, res) => {
      const brands = brandCollection.find();
      const result = await brands.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch((err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  res.send("server site is running.");
});

app.listen(port, () => {
  console.log("server side is running");
});
