const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
require("mongoose-type-url");

const CarouselSchema = new Schema({
  id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  picture: { type: mongoose.SchemaTypes.Url, required: true },
  story: { type: String, required: true },
  id: { type: String, required: false }, // make the id field optional
});

// export model
const Carousel = model("Carousel", CarouselSchema);
module.exports = Carousel;
