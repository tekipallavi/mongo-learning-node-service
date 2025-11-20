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
  countProjectDocuments, getProjects,
} = require("./src/controllers/project.controller.js");

const employeeRoutes = require("./src/routes/employee.routes.js");
const employeeRoutesV2 = require("./src-v2/routes/employee.routes.js");

const projectRoutes = require("./src/routes/project.routes.js");

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

  // test
  getProjects();
};

app.listen(process.env.PORT || 3001, () => {
  console.log("start listening!!");
});
