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
    enum: ["Approved", "Reject", "Pending","Returned","Collected"],
    default: "Pending",
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

requestSchema.pre("save",function(next){
  if(this.status==="Not Collected"){
    this.status="Rejected"
  }
  next()

})

const requestModel = mongoose.model("Request", requestSchema, "requests");
module.exports=requestModel
