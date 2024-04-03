const catchAysnc = require("../utils/catchAysnc");
const User = require("./../Models/userModel");
const jwt=require("jsonwebtoken");
exports.getUsers = catchAysnc(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "Success",
    data: {
      users,
    },
  });

  next();
});

exports.createUser = catchAysnc(async (req, res, next) => {
  console.log(req.body);
  
  
  const user = await User.create(req.body);
  res.status(200).json({
    stats: "Success",
    data: {
      user,
    },
  });

  next();
});

exports.updateUser = catchAysnc(async (req, res, next) => {
  next();
});

exports.profileDetails=catchAysnc(async (req,res,next)=>{
  const token = req.headers.authentication.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_Secret);
  const email = decodedToken.email;
  const user = await User.findOne({ email });
  console.log(user);
  const data={
    fullname: user.Name,
    role: user.role,
    branch: user.branch,
    session: user.session,
    email: user.email,
    enrollmentno: user.Enrollment_Number
  }

  res.status(200).json(data);
  next()
    
})

exports.deleteUser = catchAysnc(async (req, res, next) => {
  const deletedUser = await User.findOneAndDelete(req.body);
  res.status(202).json({
    status: "Success",
    data: {
      deletedUser,
    },
  });
  next();
});
