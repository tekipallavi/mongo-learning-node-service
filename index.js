const { client: mongoClient } = require("./db/db.connection");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
let app = express();
const {
  createFakeEmployees,
  setEmployeeDetails,
 createEmployeeIndex, getFilterSearchEmployee} = require("./src/controllers/employee.controller.js");
const {
  createProjects,
  countProjectDocuments, getProjects, updateProjectDetails
} = require("./src/controllers/project.controller.js");
const {createInterest} = require("./src/controllers/interest.contoller.js");


const employeeRoutes = require("./src/routes/employee.routes.js");
const employeeRoutesV2 = require("./src-v2/routes/employee.routes.js");
const projectRoutes = require("./src/routes/project.routes.js");
const interestRoutes = require("./src/routes/interest.routes.js");

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
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.use(express.json()); // To parse JSON request bodies

  //add routes

  app.use("/employee", employeeRoutes);
  app.use("/employee-v2", employeeRoutesV2);

  app.use("/project", projectRoutes);
  app.use('/interest', interestRoutes)

  // test
  createInterest('ce022cad-974a-447d-ae53-75daeb7c71bf', 'f837eb08-9939-4b05-b297-628296bf02ce');
};

app.listen(process.env.PORT || 3001, () => {
  console.log("start listening!!");
});
