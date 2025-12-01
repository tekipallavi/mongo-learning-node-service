const { db } = require("../db/db.connection");
const { collectionExists } = require("./utils");
const { collections } = require('../utils')

const createProject = async () => {
  if (collectionExists("Project")) {
    console.error("Collection already exists. Skipping creation.");
    return;
  }
  try {
    await db.createCollection("Project", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "projectId",
            "projectName",
            "clientName",
            "techStack",
            "statusId",
            "startDate",
          ],
          properties: {
            projectId: {
              bsonType: "string",
              description: "Unique identifier for the project",
            },
            projectName: {
              bsonType: "string",
              description: "Name of the project",
            },
            clientName: {
              bsonType: "string",
              description: "Name of the client associated with the project",
            },
            techStack: {
              bsonType: "array",
              uniqueItems: true,
              minItems: 1,
              maxItems: 6,
              items: {
                bsonType: "string",
                enum: [
                  "angular",
                  "javascript",
                  "react",
                  "nodejs",
                  "azure",
                  ".net",
                ],
              },
              description:
                "Array of technologies required for the project; must be from the predefined list",
            },
            statusId: {
              bsonType: "number",
              enum: [1, 2, 3, 4, 5],
              description:
                "Numeric status code representing project state (e.g., 1=open for interest, 2=pending interests, etc.)",
            },
            interests: {
              bsonType: "array",
              uniqueItems: true,
              items: {
                bsonType: "string",
              },
              description:
                "List of employee IDs who have shown interest in this project",
            },
            selectedInterests: {
              bsonType: "array",
              uniqueItems: true,
              items: {
                bsonType: "string",
              },
              description:
                "List of employee IDs whose interests have been accepted by the admin",
            },
            proposals: {
              bsonType: "array",
              uniqueItems: true,
              description: "Array of proposal IDs submitted for this project",
            },
            acceptedProposal: {
              bsonType: "string",
              description:
                "Proposal ID that has been accepted for this project",
            },
            startDate: {
              bsonType: "date",
              description: "Start date of the project",
            },
            endDate: {
              bsonType: "date",
              description: "End date of the project (optional)",
            },
          },
        },
      },
    });
    console.log("Project collection created successfully.");
  } catch (error) {
    if (error.codeName === "NamespaceExists") {
      console.error("Collection already exists. Skipping creation.");
    } else {
      console.error("Error creating collection:", error.message);
    }
  }
};


const createProjectColMod = async () => {
  try {
    const result = await db.command({
      collMod: collections.project,
      validationLevel: "moderate", // Apply validation to new/updated docs
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "projectId",
            "projectName",
            "clientName",
            "techStack",
            "statusId",
            "startDate",
            "description"
          ],
          properties: {
            projectId: {
              bsonType: "string",
              description: "Unique identifier for the project",
            },
            projectName: {
              bsonType: "string",
              description: "Name of the project",
            },
            clientName: {
              bsonType: "string",
              description: "Name of the client associated with the project",
            },
            techStack: {
              bsonType: "array",
              uniqueItems: true,
              minItems: 1,
              maxItems: 6,
              items: {
                bsonType: "string",
                enum: [
                  "angular",
                  "javascript",
                  "react",
                  "nodejs",
                  "azure",
                  ".net",
                ],
              },
              description:
                "Array of technologies required for the project; must be from the predefined list",
            },
            statusId: {
              bsonType: "number",
              enum: [1, 2, 3, 4, 5],
              description:
                "Numeric status code representing project state (e.g., 1=open for interest, 2=pending interests, etc.)",
            },
            interests: {
              bsonType: "array",
              uniqueItems: true,
              items: {
                bsonType: "string",
              },
              description:
                "List of employee IDs who have shown interest in this project",
            },
            selectedInterests: {
              bsonType: "array",
              uniqueItems: true,
              items: {
                bsonType: "string",
              },
              description:
                "List of employee IDs whose interests have been accepted by the admin",
            },
            proposals: {
              bsonType: "array",
              uniqueItems: true,
              description: "Array of proposal IDs submitted for this project",
            },
            acceptedProposal: {
              bsonType: "string",
              description:
                "Proposal ID that has been accepted for this project",
            },
            startDate: {
              bsonType: "date",
              description: "Start date of the project",
            },
            endDate: {
              bsonType: "date",
              description: "End date of the project (optional)",
            },
            description: {
              bsonType: "string",
              description: "Description should be a string"
            }
          },
        },
      }
    })
    console.log("result of col mod", result);
  } catch (e) {
    console.log("error in col mod", e)
  }
}

const checkUser = async () => {
  const user = await db.command({ usersInfo: 'tekipallavi' });
  console.log("user*********", user.users[0].roles)
}

const changeUserRole = async () => {
  const result = await db.command({
    grantRolesToUser: "tekipallavi", // Username to modify
    roles: [
      { role: "dbAdminAnyDatabase", db: "admin" }, // Add dbAdmin privileges
      { role: "readWriteAnyDatabase", db: "admin" } // Keep existing role
    ]
  });
  checkUser();

}

module.exports = { createProject, createProjectColMod, checkUser, changeUserRole };
