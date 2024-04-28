const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9zrvau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const productsCollection = client
      .db("art&craftDB")
      .collection("productsCollection");
    const paintingCollection = client
      .db("art&craftDB")
      .collection("paintingCollection");
    // methods start

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/paintings", async (req, res) => {
      const cursor = paintingCollection.find();
      const paintings = await cursor.toArray();
      res.send(paintings);
    });
    app.get("/products/:category", async (req, res) => {
      const category = req.params.category;
      console.log(category);
      const result = await productsCollection
        .find({ category: category })
        .toArray();
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const data = req.body;
      data.timestamp = new Date();
      const result = await productsCollection.insertOne(data);
      res.send(result);
    });
    app.get("/user/:user_email", async (req, res) => {
      const email = req.params.user_email;
      const result = await productsCollection
        .find({ user_email: email })
        .toArray();
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upset: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          category: updateProduct.category,
          rating: updateProduct.rating,
          price: updateProduct.price,
          time: updateProduct.time,
          photo: updateProduct.photo,
          subcategory: updateProduct.subcategory,
          stockStatus: updateProduct.stockStatus,
          customization: updateProduct.customization,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is Arts & Crafts website");
});
app.listen(port, () => {
  console.log(`This port open in http://localhost:${port}`);
});
