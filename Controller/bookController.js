const Book = require("./../Models/bookModel");
const catchAsync = require("./../utils/catchAysnc");

exports.getBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json(books);
  next();
});

exports.getBook = catchAsync(async (req, res, next) => {
  const id = req.query.id;
  const book = await Book.findById(id);
  res.status(200).json(book);
  next();
});

exports.createBooks = catchAsync(async (req, res, next) => {
  const book = await Book.create(req.body);
  res.status(200).json({
    status: "Succes",
    data: {
      book,
    },
  });

  next();
});

exports.updateBook = catchAsync(async (req, res, next) => {
  next();
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const data = req.body;
  const deletedBook = await Book.findOneAndDelete(data);
  res.status(202).json({
    status: "Success",
    data: {
      deletedBook,
    },
  });

  next();
});
