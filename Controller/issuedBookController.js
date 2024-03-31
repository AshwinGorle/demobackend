const User = require("./../Models/userModel");
const mongoose = require("mongoose");
const Book = require("./../Models/bookModel");
const IssuedBook = require("./../Models/issuedBooksmodel");
const Request = require("./../Models/issueModel");
const catchAsync = require("./../utils/catchAysnc");
const jwt = require("jsonwebtoken");
exports.checkIssuedBooks = catchAsync(async (req, res, next) => {
  const token = req.headers.authentication.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_Secret);
  const email = decodedToken.email;
  const user = await User.findOne({ email }).select("role");

  const role = user.role;
  if (role !== "Admin") {
    return res.status(401).json({
      status: "Unauthorized",
    });
  }

  const enrollment_No = req.body.enrollment_No.toUpperCase();

  const student = await User.findOne({ Enrollment_Number: enrollment_No });
  if (!student) {
    return res.status(404).json({
      status: "Not Found",
    });
  }
  const studentEmail = student.email;
  const issuedBooks = await IssuedBook.find({ email: studentEmail });

  res.status(200).json(issuedBooks);
  next();
});

exports.returnBook = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.query.id;
    const Fine = req.body.Fine;

    const returnedBook = await IssuedBook.findOneAndUpdate(
      { _id: id },
      { returnTime: Date.now(), Fine },
      { new: true, session }
    );

    const updatedRequest = await Request.findOneAndUpdate(
      { _id: returnedBook.Request_id },
      { status: "Returned" },
      { new: true, session }
    );

    const updatedBook = await Book.findOneAndUpdate(
      { Name: returnedBook.book },
      { $inc: { qty: +1 } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(returnedBook);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }

  next();
});

exports.statistics = catchAsync(async (req, res, next) => {
  const token = req.headers.authentication.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_Secret);
  const email = decodedToken.email;
  const user = await User.findOne({ email }).select("role");

  const role = user.role;
  if (role !== "Admin") {
    return res.status(401).json({
      status: "Unauthorized",
    });
  }
  const { year } = req.query;

  // Validate the year parameter
  if (!year || isNaN(year)) {
    return res.status(400).json({ error: "Invalid year parameter" });
  }

  const yearInt = parseInt(year);

  const booksPerMonth = await IssuedBook.aggregate([
    {
      $match: {
        issueTime: {
          $gte: new Date(yearInt, 0), // Start of the year
          $lt: new Date(yearInt + 1, 0), // Start of next year
        },
      },
    },
    {
      $project: {
        month: { $month: "$issueTime" },
        year: { $year: "$issueTime" },
      },
    },
    {
      $group: {
        _id: { month: "$month", year: "$year" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        count: 1,
      },
    },
  ]);

  const totalFine = await IssuedBook.aggregate([
    {
      $match: {
        Fine: { $exists: true },
        issueTime: {
          $gte: new Date(yearInt, 0),
          $lt: new Date(yearInt + 1, 0),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalFine: { $sum: "$Fine" },
      },
    },
  ]);

  const totalBooksIssued = await IssuedBook.countDocuments({
    issueTime: {
      $gte: new Date(yearInt, 0),
      $lt: new Date(yearInt + 1, 0),
    },
  });

  res.json({
    booksIssuedPerMonth: booksPerMonth,
    totalFine: totalFine.length > 0 ? totalFine[0].totalFine : 0,
    totalBooksIssued: totalBooksIssued,
  });
});
