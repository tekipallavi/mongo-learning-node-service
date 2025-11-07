const { create } = require("migrate-mongo");
const { db, client } = require("../db/db.connection");
const { listAllCollections } = require("./utils");
const { createProject } = require("./project-script");
const { createEmployeesCollection } = require("./employee-scripts");
const { createVersionsCollection } = require("./version-scripts");

const getConnection = async () => {
  await client.connect();
};

const executeScript = () => {
  createProject();
  createEmployeesCollection();
  createVersionsCollection();
  listAllCollections();
};

getConnection();
executeScript();
