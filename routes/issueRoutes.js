const express = require("express");
const RequestController = require("./../Controller/RequestController");
const router = express.Router();
router.route("/checkRequests").get(RequestController.checkRequests);
router.route("/requestBook").post(RequestController.requestBook);
router.route("/Approve").post(RequestController.approveRequest);
module.exports = router;
