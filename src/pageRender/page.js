const  RefComplaint=require("../model/storeRefComplaint")
const Course=require("../model/couse")
const Email=require("../model/email")
const StaffMail=require("../model/staffMail")

module.exports={
    register: (req, res)=>{
        res.render("register")
    },
    login: (req, res)=>{
        res.render("login")
    },
    home: (req, res)=>{
        res.render("index")
    },
    errorPage: (req, res)=>{
        res.render("errorPage")
    },
    // sttudent page......................................................................................


    // userDashBord: (req, res)=>{
    //     try {
    //         const user=req.user
    //         if(!user){
    //             return res.status(404).render('errorPage', { message: 'Complaint not found' });
    //         }
    //         console.log('user in session', user);
    //         res.render("./userView/userDashBord",{user})
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send(error)
    //     }
 
 
    // },
    userDashBord:async (req, res) => {
        try {
            let data
            const response=await fetch("http://localhost:5000//api/user/notification")
            if(response.ok){
                data=await response.json()
            }
            const user = req.user;
            
            if (!user) {
                res.status(404).render('errorPage');
                
            }
            const userEmail=user.email
            console.log("user",userEmail)
            const notify= await Email.findOne({email: userEmail})
            console.log("user email", notify)
    
            console.log('User in session:', user);
            res.render('./userView/userDashBord', { user,notify });
        } catch (error) {
            console.error('Error in userDashBord:', error);
            res.status(500).render('errorPage', { message: 'Internal server error' });
        }
    },
    
    studentProfile: async(req, res)=>{
        try {
            const user=req.user
            const userEmail=user.email
            console.log("user",userEmail)
            const notify= await Email.findOne({email: userEmail})
            console.log('user in session in profile', user);

            
        res.render("./userView/studentProfile",{user,notify})

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:error.message
            })
            
        }
      
        


    },
    studentCheckResult:async(req, res)=>{
        try {
            const user=req.user
            console.log('user in session in result', user);
            res.render("./userView/studentResult")
        
        } catch (error) {
            console.error('Error in userDashBord:', error);
            res.status(500).render('errorPage', { message: 'Internal server error' });
        }
    },
    // sttudent page......................................................................................



//    staff page................................................................................................

staffProfilePage: async (req, res) => {
    try {
        const staff = req.loginStaff;
   
       console.log('staff data',staff);
        res.render("./staffView/staffProfile",{user:staff});
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send('Internal server error');
        }
    }

},
staffResolveComplaintPage: async (req, res) => {
    try {
        const mat_no = req.query.mat_no;
        const semester = req.query.semester;

        // Validate the matric number
        if (!mat_no) {
            return res.status(400).json({ message: 'Matric number is required' });
        }

        // Make a request to the API to fetch complaint details based on the matric number and semester
        const response = await fetch(`http://localhost:5000/api/staff/foward/complaint?mat_no=${mat_no}&semester=${semester}`);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch complaint details');
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the complaint data exists in the response
        if (!data || !data.complaint) {
            return res.status(404).send('Complaint not found');
        }

        console.log('Fetched staff and student complaint:', data);

        // Render the complaint data on the specified page
        res.render('./staffView/staffResolveComplaint', { complaint: data.complaint });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
},

  staffViewResolvedComplaint: async(req,res)=>{
    try {
        const response = await fetch("http://localhost:5000/api/staff/find/all/resolved/complaints");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const complaint= data.resolvedComplaint
        console.log("staff viewing all resolved complaint in fetch", complaint);
        res.render("./staffView/resolvedComplaint", { complaint });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).send("Error fetching feedback");
    }


  },
 
    staffUpdateCourse:async (req, res)=>{
         const courseId=req.query.id;
         const response= await fetch(`http://localhost:5000/api/staff/find/course/id?id=${courseId}`)
         const data=  await response.json()
         const  courses=data.course
         const response2= await fetch(`http://localhost:5000/api/find/registered/staffs`)
         const data1=await response2.json()
         console.log("log data",data)
         console.log('course id in fetch',courses);
        res.render("./staffView/staffUpdateCourse",{courses})
    },
    staffViewComplaint: async (req, res) => {
        try {
            const complaint_id = req.query.id; // Get the complaint ID from the query parameters
            const response = await fetch(`http://localhost:5000/api/staff/view/complaint?id=${complaint_id}`);
            
            // Check if the response is okay
            if (!response.ok) {
                console.error("Network response failed", response.statusText);
                return res.status(401).json({
                    error: "Network response failed",
                });  
            }
    
            const data = await response.json(); // Parse the JSON response
            console.log("Fetched complaint data:", data); // Log the fetched complaint data
    
            // Check if the complaint data is present
            if (data.status === 'success' && data.complaint) {
                // Render the complaint form with the fetched complaint data
                return res.render("./staffView/staffViewComplaintForm", { complaint: data.complaint });
            } else {
                // Handle case where no complaint data is found
                console.error("No complaint data found:", data);
                return res.status(404).json({
                    error: "No complaint found for the provided ID",
                });
            }
        } catch (error) {
            console.error('Error fetching complaint:', error); 
            return res.status(500).json({ error: error.message });
        }
    },
    
    
    staffDashBord:async (req, res)=>{
        try {
            const staff = req.loginStaff;
        
            if (!staff) {
                return res.status(401).json({
                    status: "fail",
                    message: "Unauthorized access. Please log in as a staff member."
                });
            }
        
            const staffId = staff._id;
            const courses = await Course.find({ staff: staffId });
        
            // Normalize course codes to lowercase and trim spaces
            const courseCodes = courses.map(course => course.course_code.trim().toLowerCase());
            console.log("Normalized course codes to search for complaints:", courseCodes);
        
            // Find complaints related to these courses
            const allComplaints = await RefComplaint.find({
                course_code: { $in: courseCodes }
            }).populate('student', 'fname lname email matric');
        
            console.log("Complaints returned by query:", allComplaints);
        
            // Render the page regardless of whether complaints are found
            res.render("./staffView/staffDashBord", { staff, allComplaints });
        } catch (error) {
            console.error("Error loading staff dashboard:", error);
            res.status(500).send("Internal Server Error");
        }
        

        
           

        
        

    },
    courseStatus: (req, res)=>{
       const  staffId=req.query.staffId
       console.log("stafid in req ",staffId);
       
        res.render("./staffView/staffRegisterCourse",{staffId})
    },
    updateResult: async (req, res) => {
        try {
            // Destructure mat_no and section from the query parameters
            const { mat_no, section, level, semester } = req.query;
            console.log('Query Parameters:', { mat_no, section, level, semester });
    
            // Check if all required parameters are provided
            if (mat_no && section && level && semester) {
                // Construct the API URL with query parameters
                const apiUrl = `http://localhost:5000/api/staff/view/user/result?mat_no=${encodeURIComponent(mat_no)}&section=${encodeURIComponent(section)}&level=${encodeURIComponent(level)}&semester=${encodeURIComponent(semester)}`;
                const response = await fetch(apiUrl);
    
                // Check for a successful response
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
    
                // Parse the JSON response
                const data = await response.json();
                console.log('API Response Data:', data);
    
                // Extract user data from the response
                const user = data.user;
                if (!user) {
                    throw new Error('No user data found in the response');
                }
    
                console.log('User Data:', user);
    
                // Render the EJS template and pass the user data
                res.render("./staffView/updateResult", { user });
            } else {
                // Handle case where required parameters are missing
                console.log('Missing required query parameters.');
                res.status(400).send('Missing required query parameters.');
            }
        } catch (error) {
            console.error('Error in updateResult:', error);
            res.status(500).send('An error occurred while fetching data.');
        }
    },
    
  
    uploadResult: (req, res)=>{
        res.render("./staffView/uploadResult")
    },
    staffAllComplaint: async(req, res)=>{
        try {
        
            const allComplaints = await RefComplaint.find().populate('student', 'fname lname email matric');
            console.log(" staff view all complaint ",allComplaints)

        
            res.render("./staffView/staffViewAllComplaint",{allComplaints})
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        

    },
    staffViewUserResult: async (req, res) => { 
        try {
            // Retrieve parameters from the query
            const { mat_no, section, level, semester } = req.query;
            console.log('Query Parameters:', { mat_no, section, level, semester }); // Log the query parameters
    
            // Check if all required parameters are provided
            if (mat_no && section && level && semester) {
                // Construct the URL with query parameters
const apiUrl = `http://localhost:5000/api/staff/view/user/result?mat_no=${encodeURIComponent(mat_no)}&section=${encodeURIComponent(section)}&level=${encodeURIComponent(level)}&semester=${encodeURIComponent(semester)}`;
                const response = await fetch(apiUrl);
    
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                } 
                const data = await response.json();
                console.log('API Response Data:', data); // Log the API response data
    
                const user = data.user;
                if (!user) {
                    throw new Error('No user data found in the response');
                }
      
                console.log('User Data:', user);
                res.render("./staffView/staffViewUserResult", { user });
            } else {
                throw new Error('Matric number, section, level, and course code must be provided');
            }
        } catch (error) {
            console.error('Error fetching user result:', error);
            res.status(500).send({ status: 'error', message: error.message });
        }
    },
    staffViewAllUploadedResult: async(req, res)=>{
        try {
         
            response=await fetch("http://localhost:5000/api/staff/view/user/result")
            const data= await response.json()
            const uploadedResult=data.results
            console.log('all uploade fff result in fetch',...uploadedResult);
            
        res.render("./staffView/staffViewUploadedResult",{studentData:uploadedResult})
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
            
        }
    },
    
      
   
   //    staff page................................................................................................


 
  
    

    

    



    //admin page functionality////////////////////////////////////////////////////////////////////////////////////
    adminViewResult: async(req, res)=>{
        try {
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
            response=await fetch("http://localhost:5000/api/admin/view/uploaded/result")
            const data= await response.json()
            const uploadedResult=data.result
            console.log('all user result in fetch',uploadedResult);
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
            
        res.render("./adminView/allUploadedResult",{uploadedResult,notify})
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
            
        }
    },
    adminViewStudentResult: async(req, res)=>{
        try {
            const resultId=req.query.id
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
            response=await fetch(`http://localhost:5000/api/admin/view/uploaded/result?id=${resultId}`)
            const data= await response.json()
            const uploadedResult=data.result
            console.log('student result in fetch',uploadedResult);
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
            
        res.render("./adminView/adminViewResult",{uploadedResult,notify})
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
            
        }
    },
    allNewComplaint:async (req, res)=>{
        try {
        
            const response2= await fetch("http://localhost:5000/api/all/complaints")
            const data2=await response2.json()
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
            const allComplaints=data2.allComplaint
        
        
            console.log('all  new page complaint in fetch',allComplaints );
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
           
            res.render("./adminView/allNewComplaint",{allComplaints,notify})
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        
    },
    complaintForm:async (req, res)=>{
        try {
        const complaintId=req.query.id
        const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
            const response2= await fetch(`http://localhost:5000/api/all/complaints?id=${complaintId}`)
            const data2=await response2.json()
            const complaint=data2.complaint
            
        
        
            console.log(' complaint  form  id in fetch',complaint);
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
           
            res.render("./adminView/complaintForm",{complaint,notify})
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        
       
    },
   
    adminDashBord: async(req, res)=>{
      
        try {
            const response1 = await fetch('http://localhost:5000/api/find/user/profile');
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data = await response1.json();
            const data6 = await response6.json();
            const registeredStudents = data.allUser; // Accessing the allUsers array from the response
            const response2= await fetch("http://localhost:5000/api/all/complaints")
            const data2=await response2.json()
            const allComplaints=data2.allComplaint
            const response3 = await fetch("http://localhost:5000/api/admin/find/all/resolve/complaints");
            if (!response3.ok) {
                throw new Error(`HTTP error! status: ${response3.status}`);
            }
            const data3 = await response3.json();
            const complaint= data3?data3.allresolved:"";
            console.log("feed back in fetch", complaint);
        
            console.log('Registered students',registeredStudents );
            console.log('all complaint in fetch',allComplaints );
            const admin= req.loginAdmin
            console.log('admin in req',admin);
            // const notification=-await StaffMail.find()
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
            res.render("./adminView/adminDashBord",{admin,registeredStudents,allComplaints,complaint,notify })
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
    },
    complaints: async(req, res)=>{
        try {
        
            const response2= await fetch("http://localhost:5000/api/all/complaints")
            const data2=await response2.json()
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
            const allComplaints=data2.allComplaint
        
            console.log('all complaint in fetch',allComplaints );
           
            res.render("./adminView/viewComplaints",{allComplaints, notify})
      
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        
    },
    feedbackpage: async (req, res) => {
        try {
            
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
         
            const response = await fetch("http://localhost:5000/api/admin/find/all/resolve/complaints");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
            const data = await response.json();
            const complaint= data.allresolved
            console.log("feed back in fetch", complaint);
            res.render("./adminView/staffFeedBack", { complaint ,notify});
        } catch (error) {
            console.error("Error fetching feedback:", error);
            res.status(500).send("Error fetching feedback");
        }
    },
    registeredStaff:async (req, res)=>{
        // about to right
        try{
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
            
        const response = await fetch('http://localhost:5000/api/find/registered/staffs');
        const data = await response.json();
        const registeredStaff = data.allStaffs; // Accessing the allUsers array from the response
    
        console.log('Registered students',registeredStaff );
        const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
    
        res.render('./adminView/registeredStaffs',{registeredStaff,notify});
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    
    },
    viewFeedback: async (req, res) => {
        try {
            const complaintId = req.query.id;
    
            console.log(`Fetching data for complaintId: ${complaintId}`);
    
            // Fetch complaint data
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
            const responseComplaint = await fetch(`http://localhost:5000/api/admin/find/all/resolve/complaints?id=${complaintId}`);
            if (!responseComplaint.ok) {
                throw new Error(`Failed to fetch complaint data. Status: ${responseComplaint.status}`);
            }
            const dataComplaint = await responseComplaint.json();
            const complaint = dataComplaint.viewComplaint;
    
            console.log("Complaint data fetched:", complaint);
    
            const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
          
            res.render("./adminView/viewFeedBack", { complaint,notify});
        } catch (error) {
            console.error("Error fetching feedback:", error);
            res.status(500).send("Error fetching feedback");  
        }
    },
    
    registeredStudent: async(req, res)=>{


        try {
            const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
            const data6 = await response6.json();
          const response = await fetch('http://localhost:5000/api/find/registered/students');
          const data = await response.json();
          const registeredStudents = data.allUser; // Accessing the allUsers array from the response
      
          console.log('Registered students',registeredStudents );
          const notification=data6.notification           
            console.log("satff notification12",notification)
            const notify=notification?notification:'';
          
          res.render('./adminView/registeredStudent',{registeredStudents,notify});
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: error.message });
        }
        
    },
       
    
    adminProfile:async (req, res)=>{
        const admin= req.loginAdmin
        const response6 = await fetch('http://localhost:5000/api/admin/find/staff/notification');
        const data6 = await response6.json();
        console.log('admin in req profile',admin);
        const notification=data6.notification           
        console.log("satff notification12",notification)
        const notify=notification?notification:'';

        res.render('./adminView/adminProfile', { admin ,notify});
    },
    
        // admin page.....................................................................................

}