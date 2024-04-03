const User = require("./../Models/userModel");
const Book = require("./../Models/bookModel");
const Request = require("./../Models/issueModel");
const IssuedBook = require("./../Models/issuedBooksmodel");
const catchAsync = require("./../utils/catchAysnc");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const template = require("./../utils/emailTemplate");

exports.checkRequests = catchAsync(async (req, res, next) => {
  const token = req.headers.authentication.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_Secret);
  const email = decodedToken.email;
  const user = await User.findOne({ email }).select("role");
  const role = user.role;
  let requests = {};
  if (role === "Student") {
    requests = await Request.find({ email });
  } else if (role === "Admin") {
    requests = await Request.find();
  } else {
    res.status(403).json({
      error: "Wrong User role",
    });
  }

  requests = requests.filter(
    (el) => el.status === "Pending" || el.status === "Approved"
  );

  res.status(200).json({ requests, role });
  next();
});

exports.requestBook = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const token = req.headers.authentication.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_Secret);
  const email = decodedToken.email;
  const book = await Book.findOne({ _id: id });
  const bookName = book.Name;
  const checkRequests = await Request.find({ email, book: bookName });
  for (const checkRequest of checkRequests) {
    if (
      checkRequest.status === "Pending" ||
      checkRequest.status === "Approved" ||
      checkRequest.status === "Collected"
    ) {
      return res.status(400).json({ status: "Failed" });
    }
  }

  const request = await Request.create({
    email,
    book: bookName,
    status: "Pending",
  });
  if (!request) {
    res.status(400).json({
      Status: "Failed",
    });
    return;
  }

  res.status(200).json({
    status: "Success",
    data: {
      request,
    },
  });
  next();
});

exports.approveRequest = catchAsync(async (req, res, next) => {
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

  const bookName = req.body.book;

  const book = await Book.findOne({ Name: bookName });

  if (!book) {
    return res.status(404).json({ status: "Book Not Found" });
  }

  if (book.qty === 0) {
    return res.status(404).json({ status: "Not Found" });
  }
  const id = req.query.id;
  const studentEmail = req.body.email;
  const status = req.body.status;
  const student = await User.findOne({ email: studentEmail });
  const studentName = student.Name;
  const updateRequest = await Request.findOneAndUpdate(
    { _id: id },
    { status: status },
    { new: true }
  );

  if (status === "Rejected") {
    return res.status(403).json({ status: "Rejected" });
  }

  if (status === "Approved") {
    const updatedBook = await Book.findOneAndUpdate(
      { Name: bookName },
      { $inc: { qty: -1 } },
      { new: true }
    );

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 15);

    const details = {
      book: updatedBook.Name,
      author: updatedBook.author,
      ISBN: updatedBook.ISBN,
      dueDate: futureDate.toISOString().split("T")[0], // Convert to ISO string and extract only the date part
    };

    const message=template(details);

    sendEmail({ email: studentEmail,message });
    return res.status(200).json({
      status: "Approved",
    });
  }

  if (status === "Not Collected") {
    const updatedBook = await Book.findOneAndUpdate(
      { Name: bookName },
      { $inc: { qty: +1 } },
      { new: true }
    );

    return res.status(403).json({
      Status: "Rejected",
    });
  }
  const issuedBooks = await IssuedBook.create({
    Name: studentName,
    email: studentEmail,
    book: bookName,
    Request_id: updateRequest._id,
  });

  res.status(200).json({
    status: "Collected",
  });
  next();
});
