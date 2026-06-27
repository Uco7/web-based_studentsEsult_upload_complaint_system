// const express=require('express')
// const path=require("path");
// const bodyParser = require('body-parser');
// const sessionMildleWare=require("./src/helper/sessionMidleWare")
// const complaintDb=require("./src/connectDB/connectDB")
// const pageRenderRoute=require("./src/route/pageRoute")
// const registerRoute=require("./src/route/registerActor")
// const userHandleRoute=require("./src/route/userAuthRoute")
// const apiFindRoute=require("./src/route/crudeRute")

// require("dotenv").config()
// const app=express()
// complaintDb()
// app.set('views', path.join(__dirname, 'view'));

// app.set("view engine","ejs")
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
// app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
// // app.use((req, res, next) => {
// //     res.status(404).render('errorPage');
// // });


// // Global error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('error');
// });
// app.use(express.static(path.join(__dirname, "public")))
// app.use(sessionMildleWare)

// app.use(pageRenderRoute)
// app.use(registerRoute)
// app.use(userHandleRoute)
// app.use(apiFindRoute)
// const PORT=process.env.PORT
// app.listen(PORT,()=>{
//     console.log('app listen on port 5000')})





// 1. Force the internal Node.js runtime to query Google DNS (Fixes Node 22 Windows SRV lookup bugs)
const dns = require('node:dns/promises');
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// 2. Load environment configurations immediately 
require("dotenv").config();

// 3. Import Standard Modules
const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');

// 4. Import Project-Specific Helpers & Database Configuration
const sessionMildleWare = require("./src/helper/sessionMidleWare");
const complaintDb = require("./src/connectDB/connectDB");

// 5. Import Routing Architecture
const pageRenderRoute = require("./src/route/pageRoute");
const registerRoute = require("./src/route/registerActor");
const userHandleRoute = require("./src/route/userAuthRoute");
const apiFindRoute = require("./src/route/crudeRute");

// 6. Initialize App Instance and Establish Cloud Database Connectivity
const app = express();
complaintDb();

// 7. Template Engine and Structural View Asset Management
app.set('views', path.join(__dirname, 'view'));
app.set("view engine", "ejs");

// 8. Body Parsing & Form Processing Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 9. Static Dependency Delivery Pipelines (Bootstrap & jQuery)
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, "public")));

// 10. Session Lifecycle Management Middleware
app.use(sessionMildleWare);

// 11. Application Endpoint Route Hooks
app.use(pageRenderRoute);
app.use(registerRoute);
app.use(userHandleRoute);
app.use(apiFindRoute);

// 12. Catch-All Application Error Boundaries
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error');
});

// 13. System Server Bind Execution
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`);
});
