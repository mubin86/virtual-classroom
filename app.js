const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);

module.exports = app;