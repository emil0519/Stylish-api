const express = require("express");
const router = express.Router();
const Carousel = require("../model/Carousel");

router.get("/marketing/campaigns", async (req, res) => {
  try {
    const carousel = await Carousel.find({});
    const customizedCarousel = carousel.map((each) => {
      const { product_id, picture, story } = each;
      return { product_id, picture, story };
    });
    const carouselWithData = { data: [...customizedCarousel] };
    return res.json(carouselWithData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.post("/marketing/campaigns", async (req, res) => {
  try {
    const existing = await Carousel.findOne({
      product_id: req.body.product_id,
    });
    if (existing) {
      return res.status(403).json({ message: "Data already exist" });
    }
    const { product_id, picture, story } = req.body;
    const newCarousel = new Carousel({ product_id, picture, story });
    await newCarousel.save();
    return res.status(201).json(newCarousel);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.delete("/marketing/campaigns/:product_id", async (req, res) => {
  try {
    const carousel = await Carousel.findOne({
      product_id: req.params.product_id,
    });
    if (!carousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }
    await Carousel.findByIdAndDelete(carousel._id);
    return res.json({ message: "Carousel deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
