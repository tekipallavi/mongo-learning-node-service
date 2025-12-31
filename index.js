const { client: mongoClient } = require("./db/db.connection");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
let app = express();
const {generateJWTToken, authenticator: authenticationMiddleware, addTokenTORequest} = require("./src/middlewares/auth.js");
const {
  createFakeEmployees,
  setEmployeeDetails,
  createEmployeeIndex,
  getFilterSearchEmployee,
  getRandomEmployeeIds
} = require("./src/controllers/employee.controller.js");
const {
  createProjects,
  countProjectDocuments,
  getProjects,
  updateProjectDetails,
  getRandomProjects
} = require("./src/controllers/project.controller.js");
const {
  createInterest,
  getInterestsForEmployee,
  generateInterestsForRandomEmployees
} = require("./src/controllers/interest.contoller.js");
const { empPerformMetrics, selectInterests, query3, query5, query6, query9}  = require('./learn/learning.js');
const { query3: query3V2, query4, query5: query5V2 }  = require('./learn/learning-v2.js');


const employeeRoutes = require("./src/routes/employee.routes.js");
const projectRoutes = require("./src/routes/project.routes.js");
const interestRoutes = require("./src/routes/interest.routes.js");

//V2 routes
const employeeRoutesV2 = require("./src-v2/routes/employee.routes.js");
const projectRoutesV2 = require("./src-v2/routes/project.routes.js");
const interestRoutesV2 = require("./src-v2/routes/interest.routes.js");

async function startDb() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    loadService();
  } finally {
    // Ensures that the client will close when you finish/error
    //await mongoClient.close();
  }
}

startDb();
loadService = async () => {
  app.use(bodyParser.json());
  app.use(cors({
  origin: 'http://localhost:5173', // or your dev origin
  credentials: true
}));
  app.use(express.json()); // To parse JSON request bodies
  app.use(addTokenTORequest);
  app.use(authenticationMiddleware);

  //add routes

  app.use("/employee", employeeRoutes);
  app.use("/project", projectRoutes);
  app.use("/interest", interestRoutes);

  //V2 routes
  app.use("/employee-v2", employeeRoutesV2);
  app.use("/project-v2", projectRoutesV2);
  app.use("/interest-v2", interestRoutesV2);
  // test
  //createInterest('00eaa738-c7a7-4d95-97fe-dd863766ae11', 'f837eb08-9939-4b05-b297-628296bf02ce');
  //getInterestsForEmployee("f837eb08-9939-4b05-b297-628296bf02ce");
  query5V2();
};

app.listen(process.env.PORT || 3001, () => {
  console.log("start listening!!");
});
