const sendErrorDev = (err, res) => {
    console.log("err.message");
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
};
  
module.exports = (err, req, res, next) => {
// console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
};