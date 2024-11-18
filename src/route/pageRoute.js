const pageGetRoute=require("express").Router()
const pageRender=require("../pageRender/page",)
const  {logout,verifyUserToken, verifyAdminToken,verifyStaffToken}= require("../helper/jwtTokenMidleWare/authToken")
pageGetRoute.get("/registration/page",pageRender.register)
pageGetRoute.get("/login/page",pageRender.login)
pageGetRoute.get("/logout",logout)
pageGetRoute.get("/",pageRender.home)
pageGetRoute.get("/errorPage/page",pageRender.errorPage)
// admin  page route......................................................................................................
  
pageGetRoute.get("/admin/dashbord", verifyAdminToken, pageRender.adminDashBord)//  verifying admin token before heading to dashbord.....
pageGetRoute.get("/admin/view/student/result",pageRender.adminViewStudentResult)
pageGetRoute.get("/admin/view/all/resolve/complaint",pageRender.feedbackpage)
pageGetRoute.get("/admin/view/resolve/complaint",pageRender.viewFeedback)
pageGetRoute.get("/admin/view/all/complaints",pageRender.complaints)
pageGetRoute.get("/admin/view/complaints/form",pageRender.complaintForm)
pageGetRoute.get("/admin/view/all/new/complat",pageRender.allNewComplaint)
pageGetRoute.get("/admin/view/registered/student",verifyAdminToken,pageRender.registeredStudent)
pageGetRoute.get("/admin/view/registered/staff",pageRender.registeredStaff)
pageGetRoute.get("/admin/profile",verifyAdminToken,pageRender.adminProfile)
pageGetRoute.get("/admin/view/uploaded/result",pageRender.adminViewResult)
// admin  page route......................................................................................................
// staff page route  ..........................................................................................................
// pageGetRoute.get("/api/staff/view/uploaded/result/page",pageRender.StaffViewResult)
pageGetRoute.get("/staff/view/update/result/page",pageRender.updateResult)
pageGetRoute.get("/staff/upload/result",pageRender.uploadResult)
pageGetRoute.get("/staff/view/complaint",pageRender.staffViewComplaint)
pageGetRoute.get("/staff/view/AllComplaint",pageRender.staffAllComplaint)
pageGetRoute.get("/staff/proceed/resolve/complaint",pageRender.staffResolveComplaintPage)
pageGetRoute.get("/staff/view/resolved/complaints",pageRender.staffViewResolvedComplaint)

pageGetRoute.get("/staff/update/course",pageRender.staffUpdateCourse)
pageGetRoute.get("/staff/view/uploaded/result/page",pageRender.staffViewAllUploadedResult)
pageGetRoute.get("/staff/view/user/result",pageRender.staffViewUserResult)
pageGetRoute.get("/staff/profile",verifyStaffToken,pageRender.staffProfilePage)
pageGetRoute.get("/staff/Register/Course",pageRender.courseStatus)
pageGetRoute.get("/staff/dashbord", verifyStaffToken, pageRender.staffDashBord)//  verifying admin token before heading to dashbord.....
// staff page route  ..........................................................................................................
// user page Router.......................................................................
pageGetRoute.get("/user/view/result",verifyUserToken,pageRender.studentCheckResult)
pageGetRoute.get("/student/check/result",verifyUserToken,pageRender.studentCheckResult)
pageGetRoute.get("/student/profile",verifyUserToken,pageRender.studentProfile)
pageGetRoute.get("/user/dashBord", verifyUserToken, pageRender.userDashBord)// verifying user token before heading to dashBord




module.exports=pageGetRoute