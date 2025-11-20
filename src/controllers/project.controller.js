const { db } = require("../../db/db.connection");
const {
  collections,
  constructSchemaError,
  generateUUID,
} = require("../../utils");
const { faker } = require("@faker-js/faker");

const setProjectDetails = async (req, res) => {
  const record = {};
  try {
    const insertStatus = await db
      .collection(collections.project)
      .insertOne(record);
    //res.status(200).send("Working");
  } catch (e) {
    // assume 121 as schema validation error
    if (e.code === 121) {
      // res.status(400).send(constructSchemaError(e));
    }
  }
};

const getProjectDetails = async (req, res) => {
  res.send("Working");
};

async function createProjects(count = 50) {
  const TECHS = ["angular", "javascript", "react", "nodejs", "azure", ".net"];
  // await client.connect();
  try {
    const docs = [];
    for (let i = 0; i < count; i++) {
      const techCount = faker.number.int({ min: 1, max: 6 });
      const techStack = Array.from({ length: techCount }, () =>
        faker.helpers.arrayElement(TECHS)
      );
      const uniqueTechStack = [...new Set(techStack)];

      const startDate = faker.date.past({ years: 3 });
      const maybeHasEnd = faker.datatype.boolean();
      const endDate = maybeHasEnd
        ? new Date(
            startDate.getTime() +
              faker.number.int({ min: 30, max: 365 }) * 24 * 60 * 60 * 1000
          )
        : null;

      /* const proposals = Array.from(
        { length: faker.number.int({ min: 0, max: 3 }) },
        () => generateUUID()
      );
      const interests = Array.from(
        { length: faker.number.int({ min: 0, max: 5 }) },
        () => generateUUID()
      );
      const selectedInterests = interests.slice(
        0,
        Math.floor(interests.length / 2)
      );
      const acceptedProposal = proposals.length
        ? faker.helpers.arrayElement(proposals)
        : null; */

      docs.push({
        projectId: generateUUID(),
        projectName: faker.company.catchPhrase(),
        clientName: faker.company.name(),
        techStack: uniqueTechStack,
        statusId: 1,
        interests: [],
        selectedInterests: [],
        proposals: [],
        acceptedProposal: "",
        startDate,
        endDate,
      });
    }

    const result = await db
      .collection(collections.project)
      .insertMany(docs, { ordered: false });
    console.log(`Inserted ${result.insertedCount} projects`);
  } catch (e) {
    if (e && e.code === 121) {
      console.error("Schema validation failed when inserting projects:", e);
    } else {
      console.error("Error seeding projects:", e);
    }
  } finally {
    //await client.close();
  }
}

async function countProjectDocuments() {
  try {
    //const count = await db.collection(collections.project).countDocuments();
    const count = await db
      .collection(collections.project)
      .findOne({ _id: "691e73051e829b86c34f00e1" });
    console.log("Total projects in DB:", count);
  } catch (e) {
    console.error("Error counting project documents:", e);
    throw e;
  }
}

module.exports = {
  setProjectDetails,
  getProjectDetails,
  createProjects,
  countProjectDocuments,
};
