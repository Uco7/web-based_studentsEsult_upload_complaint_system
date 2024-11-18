const  Result  = require('../model/result');//storing student results
const User= require('../model/user');//  student schema for storing  student data
const Complaint=require("../model/complaint");//for storing all students  complaint
const RefComplaint=require("../model/storeRefComplaint");// for storing  reference complaints by admin
const StudentComplaint=require("../model/resolveComplaint");//for storing resolved complaints by staffs
const   Course=require("../model/couse");//fore staffs to register their courses
const Email=require("../model/email")
const StaffMail=require("../model/staffMail")
const Staff=require("../model/staff")
const nodemailer = require('nodemailer');

module.exports={
    adminViewUploadedResult: async(req,res)=>{
    //  function for admin to view all uploaded   s tudent reults
    try {
        if(req.query.id){
            const resultId=req.query.id;
            const result=await Result.findById(resultId).populate('student');
            console.log("student result",result)
            if(result){
                res.status(201).json({
                    status:"success",
                    result
                })
            }
 
        }else{ 
            const result=await Result.find().populate('student')
            if(result){
                console.log('all user result',result)
                res.status(200).json({
                    status:'success',
                    result
                })
            }
            else{
                res.status(404).json({
                    status:"no student results"
                })
            }
    
        }
     
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }

},
staffViewUploadedResult: async (req, res) => {
    try {
        const { mat_no, section, level, semester } = req.query;
        console.log("Received Query Parameters:", req.query);

        // Sanitize inputs
        const sanitizedMatNo = mat_no ? mat_no.trim() : null;
        const sanitizedSection = section ? section.trim() : null;

        // Validate the required parameters
        if (sanitizedMatNo && sanitizedSection) {
            // Construct the query object
            const queryParams = {
                matric: sanitizedMatNo,
                section: sanitizedSection,
                level: level,
                semester: semester
            };
            console.log("Querying with parameters:", queryParams);

            // Find the result based on the provided criteria
            const result = await Result.findOne(queryParams).populate('student');

            // Check if the result exists
            if (result) {
                res.status(200).json({
                    status: "success",
                    user: {
                        ...result._doc // Spread the result object
                    }
                });
            } else {
                res.status(404).json({
                    status: "fail",
                    message: "No result found for the provided criteria"
                });
            }
        } else {
            // If not all required parameters are provided, fetch all results
            const results = await Result.find().populate('student');
            if (results.length > 0) {
                console.log("All Student Results:", results);
                res.status(200).json({
                    status: "success",
                    results // Return all results
                });
            } else {
                res.status(404).json({
                    status: "fail",
                    message: "No results found"
                });
            }
        }
    } catch (error) {
        console.error("Error fetching user result:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching the results. Please try again later."
        });
    }
},



adminPostEmail: async (req,res)=>{
    const { name, email,sender_email, message, subject } = req.body;
    const sentAt = new Date();

    // Save the initial data to MongoDB
    const newEmail = new Email({ name, email, message, sender_email,subject, sentAt, status: 'pending' });
    await newEmail.save();

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Define email options directly from the request body
    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: `
            <h1>Hello, ${name}!</h1>
            
            <p >you recieved this email as  result of the complaint you layed ; sender ${sender_email}</p>
            <p>${message}</p>
            <p>Best regards,<br>Your Company</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            newEmail.status = 'failed';
            await newEmail.save();
            return res.status(500).send(error.toString());
        }
        newEmail.status = 'sent';
        await newEmail.save();
        res.status(200).send('Email sent: ' + info.response);
    });
},
//  userNotification: async(req,res)=>{
//     const notification =await email.find

//  },
staffPostEmail: async (req,res)=>{
    const { name, email,sender_email, message, subject } = req.body;
    const sentAt = new Date();

    // Save the initial data to MongoDB
    const newEmail = new StaffMail({ name, email, message, sender_email,subject, sentAt, status: 'pending' });
    await newEmail.save();

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Define email options directly from the request body
    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: `
            <h1>Hello, ${name}!</h1>
            
            <p >you recieved this email as  result of the complaint you layed ; sender ${sender_email}</p>
            <p>${message}</p>
            <p>Best regards,<br>Your Company</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            newEmail.status = 'failed';
            await newEmail.save();
            return res.status(500).send(error.toString());
        }
        newEmail.status = 'sent';
        await newEmail.save();
        res.status(200).send('Email sent: ' + info.response);
    });
},


// end.............................................................................
notifyAdmin:async(req,res)=>{
    try {
        const  notification= await StaffMail.find()
        if(notification){
            console.log("user notification",notification);
            res.status(200).json({
                status:"success",
                notification
            })
        }
        
    } catch (error) {
        res.status(500).json({
            error:error.message||"internal server error"
        })
        
    }

},
notifyUser:async(req,res)=>{
    try {
        const  notification= await Email.find()
        if(notification){
            console.log("user notification",notification);
            res.status(200).json({
                status:"success"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            error:error.message||"internal server error"
        })
        
    }

},
staffAllComplaint: async(req,res)=>{
    try {
        if(req.query.id){
            const  complaintId=req.query.id;
            const complaint=await Complaint.findById(complaintId).populate('student')
            if(!complaint){
                return res.status(404).json({
                    status:' no complaint found'
                })
            }
            else{
                console.log('single complaint',complaint)
                res.status(200).json({
                    status:"success",
                    complaint
                })
            }
        }
        else{
            const allComplaint=await Complaint.find().populate('student')
            if(allComplaint){
                console.log("all complaint",allComplaint);
                res.status(200).json({
                    status:"success",
                    allComplaint
                })
            }
        }
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }


},
allComplaint: async(req,res)=>{
    try {
        if(req.query.id){
            const  complaintId=req.query.id;
            const complaint=await Complaint.findById(complaintId).populate('student')
            if(!complaint){
                return res.status(404).json({
                    status:' no complaint found'
                })
            }
            else{
                console.log('single complaint',complaint)
                res.status(200).json({
                    status:"success",
                    complaint
                })
            }
        }
        else{
            const allComplaint=await Complaint.find().populate('student')
            if(allComplaint){
                console.log("all complaint",allComplaint);
                res.status(200).json({
                    status:"success",
                    allComplaint
                })
            }
        }
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }

},


storeComplaint: async (req, res) => {
    try {
        const {
            email,
            course_title,
            course_code,
            complaint_date,
            comment,
            matric,
            section,
            semester,
            existingRegisteredCourse,
            existingResult,
            level,
        } = req.body;
        console.log('Course code provided:', req.body.course_code);

        console.log('req.body', req.body);

        // Find student by matric number
        const student = await User.findOne({ matric });
        console.log('student data:', student);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        // Handle file uploads
        let registeredCourse = existingRegisteredCourse;
        let result = existingResult;

        if (req.files) {
            if (req.files.registeredCourse && req.files.registeredCourse[0]) {
                registeredCourse = req.files.registeredCourse[0].buffer.toString('base64');
            }
            if (req.files.result && req.files.result[0]) {
                result = req.files.result[0].buffer.toString('base64');
            }
        }

        // Ensure both registeredCourse and result are present
        if (!registeredCourse || !result) {
            return res.status(400).send("Both registeredCourse and result are required");
        }

        // Find the course by course_code
        const course = await Course.findOne({ course_code: new RegExp(`^${req.body.course_code}$`, 'i') });

        console.log('Course data:', course);

        if (!course) {
            return res.status(404).send("Course not found");
        }

        // Fetch the staff associated with the course
        const staff = await Staff.findOne({email:course.email});
        console.log('staff data:',staff);

        if (!staff) {
            return res.status(404).send("Staff not found");
        }

        console.log("Staff email:", staff.email);

        // Configure nodemailer
        let transporter = nodemailer.createTransport({  
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Define email options
        let mailOptions = {
            from: process.env.EMAIL,
            to: staff.email,  // Send the email to the staff associated with the course
            subject: `Complaint Regarding ${course_title} (${course_code})`,
            html: `
                <p>Dear ${staff.fname},</p>
                <p>A complaint has been lodged regarding the course <strong>${course_title}</strong> (Course Code: ${course_code}).</p>
                <p>Student Email: ${email}</p>
                <p>Complaint Date: ${complaint_date}</p>
                <p>Comments: ${comment}</p>
                <p>Attached are the registered course and result files for further review.</p>
                <p>Best regards,<br>Your System</p>
            `,
        };

        // Send the email
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                return res.status(500).send(error.toString());
            }
            console.log('Email sent: ' + info.response);
        });

        // Store the complaint in the database
        const newStoredComplaint = new RefComplaint({
            student: student._id,
            email,
            complaint_date,
            comment,
            registeredCourse,
            course_title,
            course_code,
            result,
            level,
            section,
            semester,
            staff: course.staff,
        });

        await newStoredComplaint.save();

        console.log("Complaint saved:", newStoredComplaint);
        return res.status(200).json({
            status: "success",
            message: "Complaint stored successfully",
            newStoredComplaint,
        });
    } catch (error) {
        console.error("Error saving complaint:", error);
        return res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
},

findStoredComplaint: async (req, res) => {
    try {
        if (req.query.id) {
            // Fetch the complaint by ID
            const complaint_id = req.query.id;
            const complaint = await RefComplaint.findById(complaint_id)
                .populate("student")
                .populate("staff");

            console.log("Complaint found:", JSON.stringify(complaint, null, 2)); // Log complaint details

            // Check if the complaint exists
            if (!complaint) {
                return res.status(404).json({
                    status: "No complaint found for this ID",
                });
            }

            // Return the single complaint
            return res.status(200).json({
                status: "success",
                complaint,
            });
        } else {
            // Fetch all complaints if no specific ID is provided
            console.log("Fetching all complaints since not all query parameters were provided.");
            const allComplaints = await RefComplaint.find()
                .populate("student")
                .populate("staff");

            if (allComplaints.length > 0) {
                console.log("All complaints:", JSON.stringify(allComplaints, null, 2));
                return res.status(200).json({
                    status: "success",
                    allComplaints,
                });
            } else {
                return res.status(404).json({
                    status: "No complaints found",
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            error: error.message,
        });
    }
},
queryStoredComplaint: async (req, res) => {
    try {
        const mat_no = req.query.mat_no;
        const semester = req.query.semester;

        console.log("semester", semester);

        // Validate the matric number
        if (!mat_no) {
            return res.status(400).json({ message: 'Matric number is required' });
        }

        // Find the student using the matric number
        const student = await User.findOne({ matric: mat_no });
        
        // Check if the student exists
        if (!student) {
            return res.status(404).json({
                status: "No student found with this matric number", 
            });
        }

        // Find the complaint using the student's _id and semester
        const complaint = await RefComplaint.findOne({
            student: student._id,
            semester: semester // Ensure the semester is checked
        })
        .populate("student")
        .populate("staff");

        // Check if the complaint exists
        if (!complaint) {
            return res.status(404).json({
                status: "No complaint found for this matric number and semester",
            });
        }

        console.log("Complaint found:", JSON.stringify(complaint, null, 2));

        // Return the complaint as a JSON response
        return res.status(200).json({
            status: "success",
            complaint,
        });
    } catch (error) {
        console.error("Error fetching complaint:", error);
        return res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
},






staffResolveComplaint: async (req, res) => {
    try {
        console.log('Received request:', req.body);
        console.log('Received files:', req.files);

        const {
            stu_name,
            department,
            matric,
            submitDate,
            comment,
            course_title,
            course_code,
            level,
            section,
            semester,
            email,
            phone_no,
            staff_name,
            status
        } = req.body;

        // Sanitize the course_code input
        const sanitizedCourseCode = course_code.trim().toUpperCase(); // Convert to uppercase if needed

        // Validate the course code format
        const isValidCourseCode = /^[A-Za-z0-9\s]+$/.test(sanitizedCourseCode);
        if (!isValidCourseCode) {
            return res.status(400).send({ message: 'Invalid course code format' });
        }

        // Check if files are present
        if (!req.files || !req.files.examAttendance || !req.files.examScore) {
            return res.status(400).send({ message: 'Files are missing' });
        }

        // Convert files to base64
        const examAttendance = req.files.examAttendance[0].buffer.toString('base64');
        const examScore = req.files.examScore[0].buffer.toString('base64');

        // Find course by course_code
        const course = await Course.findOne({ course_code: sanitizedCourseCode });
        if (!course) {
            return res.status(404).send({ message: 'Course not found for the provided course code' });
        }

        // Find uploaded result by matric
        const uploadedResult = await Result.findOne({ matric });
        if (!uploadedResult) {
            return res.status(404).send({ message: 'Uploaded result not found for the provided matric number' });
        }

        // Find staff member by email
        const staffMember = await Staff.findOne({ email: course.email });
        if (!staffMember) {
            return res.status(404).send({ message: 'Staff member not found for the provided email' });
        }

        // Create new StudentComplaint instance with data from the database
        const newResolveComplaint = new StudentComplaint({
            examAttendance,
            examScore,
            stu_name: stu_name || uploadedResult.stu_name, // Use existing student data if provided
            department: department || uploadedResult.department, // Use existing data if provided
            matric: matric || uploadedResult.matric, // Use existing matric number if provided
            submitDate: submitDate || new Date(), // Set current date if submitDate is not provided
            comment,
            course_title: course.course_title, // Use the title from the course
            course_code: sanitizedCourseCode,
            uploadedRsult: uploadedResult._id,
            level: level || uploadedResult.level, // Use existing level if provided
            section: section || uploadedResult.section, // Use existing section if provided
            semester: semester || uploadedResult.semester, // Use existing semester if provided
            email: email || uploadedResult.email, // Use existing email if provided
            phone_no, // Ensure this is provided or set as needed
            staff_name,
            staff: staffMember._id, // Associate with the staff ObjectId
            status
        });

        // Save complaint to database
        await newResolveComplaint.save();
        console.log('Resolved complaint:', newResolveComplaint);

        res.status(200).send({ message: 'Complaint submitted successfully' });

    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(400).send({ message: 'Error submitting complaint', error: error.message });
    }
},


findResolvedComplaint: async(req,res)=>{
    try{
        const resolvedComplaint=await StudentComplaint.find().populate('uploadedRsult')
        if(resolvedComplaint){
            console.log("  staff  find all resove complaint ",resolvedComplaint);
            res.status(201).json({
                status:"success",
                resolvedComplaint
            })
        }

    
  
    
} catch (error) {
    console.log(error); 
    res.status(500).json({
        error:error.message
    })
    
}

},

adminFindResolveComplaint: async(req,res)=>{
    try {
        if(req.query.id){
            const complaintId=req.query.id
            const viewComplaint=await StudentComplaint.findById(complaintId).populate('uploadedRsult')
            if(viewComplaint){
                console.log("single complaint",viewComplaint)
                res.status(201).json({
                    status:'success',
                    viewComplaint
                })
            }
        }
        else{
            const allresolved=await StudentComplaint.find().populate('uploadedRsult')
            if(allresolved){
                console.log("all resove complaint ",allresolved);
                res.status(201).json({
                    status:"success",
                    allresolved
                })
            }

        }
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }
},
findCourse: async(req,res)=>{
    try {
        if(req.query.id){
            const courseId=req.query.id;
            const course=await Course.findById(courseId)
            .populate("staff");
            if(course){
                console.log("course id:",course)
                res.status(201).json({
                    status:'success',
                    course
                })
            }
        }
    
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error.message
        })
        
    }


},


updateCourse: async (req, res) => {
    try {
        const body = req.body; // Retrieve the course data from the request body

        // Find staff by email
        const staffMember = await Staff.findOne({ email: body.email });
        console.log("staffnumber",staffMember)
        if (!staffMember) {
            return res.status(404).json({
                status: "fail",
                message: "Staff member not found"
            });
        }

        // Create a new course using the data from the body and the staff ID
        const newCourse = new Course({
            course_code: body.course_code,
            course_title: body.course_title,
            semester: body.semester,
            section: body.section,
            level: body.level,
            email: body.email,
            department: body.department,
            staff: staffMember._id // Assign the staff ID to the staff field
        });

        // Save the new course to the database
        const savedCourse = await newCourse.save();

        res.status(201).json({
            status: "success",
            course: savedCourse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
}

}