const express = require('express');
const morgan = require('morgan');
const app = express();
const userRouter = require('./routes/userRoutes');
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);

module.exports = app;