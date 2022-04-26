const Student = require("../models/studentModel");
const Classroom = require("../models/classroomModel");
const ClassroomPost = require("../models/classroomPostModel");
const StudentClassroom = require("../models/studentClassroomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const sendEmail = require('./email');


const cronTask = async options => {
    try {
        let deadlineTimeDiffernceInHour = 1;
        let allClassroomPosts = await ClassroomPost.find({ 
            deadline: { $lte: Date.now() + deadlineTimeDiffernceInHour * 60 * 60 * 1000},
            isEmailSent: false
        })
        let allClassroomsIds = allClassroomPosts.map(post => post.classroom._id);
      
        let classroomStudents = await StudentClassroom.find({ classroom: { $in: allClassroomsIds }});
        let studentEmailList =  classroomStudents.map(classroom => classroom.student.email);
        if(studentEmailList.length == 0){
            return;
        }

        const message = `You have an Exam/Assignment just after One hour. Please be prepare for that, Good Luck.`;
        await sendEmail({
            email: studentEmailList,
            subject: 'Reminder for Assignment/Exam',
            message
        });

        let allClassroomPostsIds = allClassroomPosts.map(classroomPost => classroomPost._id);

        const updatedEmailSentFlag = await ClassroomPost.updateMany(
            { _id: { $in: allClassroomPostsIds } },
            { $set: { isEmailSent : true } }
        );

        return updatedEmailSentFlag;

    } catch (error) {
        console.log("cron task error is ", error);
    }
    };
    
module.exports = cronTask;