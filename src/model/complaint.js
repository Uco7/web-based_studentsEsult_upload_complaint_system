const mongoose = require('mongoose');
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
    maxlength:6,
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
  createdAt: { type: Date, default: Date.now },


});

const Complaint = mongoose.model('Complaint', complaintSchema);


module.exports = Complaint
