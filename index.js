const express = require("express");
var cors = require("cors");
const app = express();
const port = 3002;
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
const Carousel = require("./model/Carousel");
const carouselRouter = require("./routes/carouselRouter");
const defaultCarousel = require("./data/defaultCarousel");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => console.log(`Listening port ${port}`));
  })
  .catch((error) => console.log(error));

// Insert carousel data as default
(async () => {
  try {
    const count = await Carousel.countDocuments({});
    if (count === 0) {
      await Carousel.insertMany(defaultCarousel);
      console.log("Default Carousel inserted into database");
    } else {
      console.log("Default Carousel already exist in database");
    }
  } catch (err) {
    console.error(err);
  }
})();

app.use("/api", carouselRouter);

app.get("/local", (req, res) => {
  return res.json(defaultCarousel);
});

app.get("/", async (req, res) => {
  return res.send("hi");
});
