const { db } = require("../db/db.connection.js");
const { collectionExists } = require("./utils");

const createEmployeesCollection = async () => {
  if (collectionExists("employees")) {
    console.error("Collection already exists. Skipping creation.");
    return;
  }
  try {
    await db.createCollection("employees", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["employeeID", "name", "techStack"],
          properties: {
            employeeID: {
              bsonType: "string",
              description:
                "Unique identifier for the employee, must be a string",
            },
            name: {
              bsonType: "string",
              description: "Full name of the employee",
            },
            techStack: {
              bsonType: "array",
              uniqueItems: true,
              minItems: 1,
              items: {
                bsonType: "string",
              },
              description: "Array of technologies known by the employee",
            },
            experience: {
              bsonType: ["decimal", "double", "int", "long", "null"],
              description: "Years of experience the employee has",
            },
            proposals: {
              bsonType: "array",
              uniqueItems: true,
              items: {
                bsonType: "string",
              },
              description: "Array of proposal IDs submitted by the employee",
            },
            interests: {
              bsonType: "array",
              uniqueItems: true,
              items: {
                bsonType: "string",
              },
              description:
                "Array of project IDs the employee has shown interest in",
            },
          },
        },
      },
    });
    console.log("Employees collection created successfully.");
  } catch (error) {
    if (error.codeName === "NamespaceExists") {
      console.error("Collection already exists. Skipping creation.");
    } else {
      console.error("Error creating Employee collection:", error);
    }
  }
};

const deleteEmployeesCollection = async () => {
  try {
    await db.deleteCollection("employees");
    console.log("Employees collection deleted successfully.");
  } catch (error) {
    console.error("Error deleting collection:", error.message);
  }
};

module.exports = { createEmployeesCollection, deleteEmployeesCollection };
