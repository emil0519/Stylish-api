const express = require("express");
const router = express.Router();
const Carousel = require("../model/Carousel");

router.get("/1.0/marketing/campaigns", async (req, res) => {
  try {
    const carousel = await Carousel.find({});
    const customizedCarousel = carousel.map((each) => {
      const { id, product_id, picture, story } = each;
      return { id, product_id, picture, story };
    });
    const carouselWithData = { data: [...customizedCarousel] };
    return res.json(carouselWithData);
  } catch (error) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
