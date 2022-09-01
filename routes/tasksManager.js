const express = require("express");
const router = express.Router();
const path = require("path");

router
  .route("/")
  .get((req, res) => {
    res.json({ message: "GET coming soon!" });
  })
  .post((req, res) => {
    res.json({ message: "POST coming soon!" });
  })
  .put((req, res) => {
    res.json({ message: "PUT coming soon!" });
  })
  .delete((req, res) => {
    res.json({ message: "DELETE coming soon!" });
  });

module.exports = router;
