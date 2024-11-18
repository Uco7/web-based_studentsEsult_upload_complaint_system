const mongoose = require('mongoose');

// Define the Complaint schema with nested student information
const complaintSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      course_title: {
        type: String,
        required: true,
      },
      course_code: {
        type: String,
        required: true,
      },
      complaint_date: {
        type: Date,
        required: true,
      }, 
      level: {
        type: Number,
        required: true,
      },
      registeredCourse:{  
        type: String,
        required: true,
      },
      result: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      section: {
        type: String,
        required: true,
      },
      semester: {
        type: String,
        required: true,
      },
      staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    }
    
    });
  //   complaintSchema.pre('save', function (next) {
  //     // Convert course_code to uppercase
  //     this.course_code = this.course_code.toUpperCase();
  //     next();
  // });

const RefComplaint = mongoose.model('storedRefComplaints', complaintSchema);

module.exports = RefComplaint;
