const Teacher = require("./../models/teacherModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllTeacaher = catchAsync(async (req, res, next) => {
    const teachers = await Teacher.find();

    res.status(200).json({
      status: "success",
      results: teachers.length,
      data: {
        teachers,
      },
    });
});

exports.getSpecificTeacher = catchAsync(async (req, res, next) => {
    const teacher = await Teacher.findById(req.params.id);
    // or, Teacher.findOne({ _id: req.params.id })
  
    if (!teacher) {
      return next(new AppError("No teacher found with that ID", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: {
        teacher,
      },
    });
});

exports.createTeacaher = catchAsync(async (req, res, next) => {
  // const newTeacher = new Teacher({})
  // newTeacher.save()

  //**role will be checked. If it is admin then ok otherwise return */
  const newTeacher = await Teacher.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      teacher: newTeacher,
    },
  });
});

exports.updateTeacaher = catchAsync(async (req, res, next) => {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    
      if (!teacher) {
        return next(new AppError("No teacher found with that ID", 404));
      }
    
      res.status(200).json({
        status: "success",
        data: {
            teacher,
        },
      });
});

exports.deleteTeacaher = catchAsync(async (req, res, next) => {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return next(new AppError("No teacher found with that ID", 404));
    }
  
    res.status(204).json({
      status: "success",
      data: null,
    });
});
