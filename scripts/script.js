const { create } = require("migrate-mongo");
const { client } = require("../db/db.connection");
const { listAllCollections } = require("./utils");
const { createProject } = require("./project-script");
const { createEmployeesCollection } = require("./employee-scripts");
const { createVersionsCollection } = require("./version-scripts");
const { createProposal } = require("./proposal-script");
const { createInterest } = require("./interests-script");

const getConnection = async () => {
  await client.connect();
};

const executeScript = () => {
  // createProject();
  // createProposal();
  createInterest();
};

getConnection();
executeScript();
