const express = require("express");
const router = express.Router();
const bookController = require("./../Controller/bookController");
router.route("/").get(bookController.getBooks);
router.route("/Search").get(bookController.getBook);


module.exports = router;
