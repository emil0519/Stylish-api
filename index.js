const express = require("express");
const app = express();
const port = 3002;
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth");
const bcrypt = require("bcryptjs");
const Product = require("./model/Product");
const Password = require("./model/Password");

// app.use(function (req, res) {
//   res.setHeader("Content-Type", "text/plain");
//   res.write("you posted:\n");
//   res.end(JSON.stringify(req.body, null, 2));
// });

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => console.log(`Listening port ${port}`));
  })
  .catch((error) => console.log(error));

const product = [
  { name: "洋裝", price: "350", stock: "3" },
  { name: "男裝", price: "350", stock: "3" },
  { name: "女裝", price: "350", stock: "3" },
];

const productWithID = product.map((eachProduct, index) => ({
  ...eachProduct,
  id: index,
}));

// inserted default product
(async () => {
  try {
    const count = await Product.countDocuments({});
    if (count === 0) {
      await Product.insertMany(productWithID);
      console.log("Default products inserted into database");
    } else {
      console.log("Default products already exist in database");
    }
  } catch (err) {
    console.error(err);
  }
})();

app.use("/api/auth", authRoute);

// respond ok to post api
app.post("/product", async (req, res) => {
  try {
    // create new product
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
    });
    // save product to database
    const savedProduct = await newProduct.save();
    // return new user
    return res.json(savedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.post("/password", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newPassword = new Password({
      password: hashedPassword,
    });
    const savedPassword = await newPassword.save();
    return res.json(savedPassword);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.get("/product", async (req, res) => {
  try {
    const product = await Product.find({});
    // const productsWithoutIdAndV = product.map((product, index) => {
    //   const { name, price, stock } = product;
    //   return { name, price, stock, id: index + productWithID.length };
    // });
    // const allProduct = [...productWithID, ...productsWithoutIdAndV];
    const showProduct = product.map((eachProduct, index) => {
      const { name, price, stock } = eachProduct;
      return { name, price, stock, id: index + productWithID.length };
    });
    return res.json(showProduct);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.put("/product/:id", (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  res.json({ message: "ok" });
});

app.delete("/product/:id", (req, res) => {
  const deleteIndex = productWithID.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );
  productWithID.splice(deleteIndex, 1);
  res.json({
    message: "Deleted",
    // message: `Product ${productWithID[deleteIndex].name} is deleted`,
  });
});

app.delete("/allProduct", async (req, res) => {
  try {
    await Product.deleteMany({});
    console.log("All products deleted from database");
    return res.status(200).send("All products deleted");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error deleting products");
  }
});

//test
// send content when parameter matches "/"
app.get("/api", (req, res) => {
  res.json(product);
});

app.get("/product/:id", (req, res) => {
  res.json(product[parseInt(req.params.id) - 1]);
});
