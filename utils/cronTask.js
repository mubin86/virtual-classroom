const Student = require("../models/studentModel");
const Classroom = require("../models/classroomModel");
const ClassroomPost = require("../models/classroomPostModel");
const StudentClassroom = require("../models/studentClassroomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const sendEmail = require('./email');


const cronTask = async options => {
    try {
        console.log("cros task function is called")
    
        let deadlineTimeDiffernceInHour = 1;
        let allClassroomPosts = await ClassroomPost.find({ 
            deadline: { $lte: Date.now() + deadlineTimeDiffernceInHour * 60 * 60 * 1000},
            isEmailSent: false
        })
        console.log("allClassroomPosts from cron is ", allClassroomPosts);
        let allClassroomsIds = allClassroomPosts.map(post => post.classroom._id);
      
        let classroomStudents = await StudentClassroom.find({ classroom: { $in: allClassroomsIds }});
        console.log("classroomStudents is ", classroomStudents)

        let studentEmailList =  classroomStudents.map(classroom => classroom.student.email);

        const message = `You have an Exam/Assignment just after One hour. Please be prepare for that, Good Luck.`;
        const response = await sendEmail({
            email: studentEmailList,
            subject: 'Reminder for Assignment/Exam',
            message
        });
        //some error handle will be done later

        let allClassroomPostsIds = allClassroomPosts.map(classroomPost => classroomPost._id);

        const updatedEmailSentFlag = await ClassroomPost.updateMany(
            { _id: { $in: allClassroomPostsIds } },
            { $set: { isEmailSent : true } }
        );

        console.log("email updated response is ", updatedEmailSentFlag);

        return updatedEmailSentFlag;

    } catch (error) {
        console.log("cron task error is ", error);
    }
    };
    
module.exports = cronTask;