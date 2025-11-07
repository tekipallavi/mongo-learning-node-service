const { db } = require("../db/db.connection");
const { collectionExists } = require("./utils");

const createVersionsCollection = async () => {
  if (collectionExists("versions")) {
    console.error("Collection already exists. Skipping creation.");
    return;
  }
  try {
    await db.createCollection("versions", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["versionID", "description", "timestamp", "proposalID"],
          properties: {
            versionID: {
              bsonType: "string",
              description: "Version number, must be a string",
            },
            description: {
              bsonType: "string",
              description: "Description of the version changes",
            },
            timestamp: {
              bsonType: "timestamp",
              description: "Timestamp of when the version was submitted",
            },
            proposalID: {
              bsonType: "string",
              description: "Associated proposal ID for this version",
            },
          },
        },
      },
    });
    console.log("Version collection created successfully.");
  } catch (error) {
    if (error.codeName === "NamespaceExists") {
      console.error("Collection already exists. Skipping creation.");
    } else {
      console.error("Error creating Version collection:", error);
    }
  }
};

const deleteVersionCollection = async () => {
  try {
    await db.deleteCollection("versions");
    console.log("Versions collection deleted successfully.");
  } catch (error) {
    console.error("Error deleting collection:", error.message);
  }
};

module.exports = { createVersionsCollection, deleteVersionCollection };
