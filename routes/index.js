var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

router.get("/articles", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?sources=techcrunch&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();
    res.json({ result: true, articles: data.articles });
  } catch (error) {
    res.json({ result: false, message: error });
  }
});

module.exports = router;
