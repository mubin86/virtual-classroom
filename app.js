const express = require('express');
const morgan = require('morgan');
const app = express();
const teacherRouter = require('./routes/teacherRoutes');
const classroomRouter = require('./routes/classRoomRoutes');
const studentClassroomRouter = require('./routes/studentRoutes');
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");


// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/uploads', express.static(`${__dirname}/uploads`));

app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/classroom', classroomRouter);
app.use('/api/v1/students', studentClassroomRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);

module.exports = app;