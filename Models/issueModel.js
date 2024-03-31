const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  book: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Approved", "Reject", "Pending","Returned"],
    default: "Pending",
  },
  time: {
    type: Date,
    default: Date.now,
  },
});



const requestModel = mongoose.model("Request", requestSchema, "requests");
module.exports=requestModel
