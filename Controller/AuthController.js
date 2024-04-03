const user = require("./../Models/userModel");
const catchAysnc=require("./../utils/catchAysnc")
const jwt = require("jsonwebtoken");

exports.loginHandler = catchAsync(async (req, res, next) => {
  const User = await user.findOne({ email: req.body.email }).select("+password");
  console.log(User);
  const password = User.password;
  const isAuthenticated = await User.correctPassword(
    req.body.password,
    password
  );
  if (!isAuthenticated) {
    res.status(401).json({
      status: "Failed",
    });
    return;
  }
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_Secret);
  res.status(200).json({ token, role: User.role });
  next();
}
);