const { ObjectId } = require("mongodb");
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

async function createFakeProjects(count = 50) {
  const TECHS = ["angular", "javascript", "react", "nodejs", "azure", ".net"];
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
    const count = await db.collection(collections.project).countDocuments();
    console.log("Total projects in DB:", count);
  } catch (e) {
    console.error("Error counting project documents:", e);
    throw e;
  }
}

const getProjects = async (req, res) => {
  try {
    let techStack = [];
    if (req && req.body && req.body.techStack && req.body.techStack.length) {
      techStack = req.body.techStack.split(",").map(tech => tech.trim());
    }else{
      techStack = ['react'];
    }
    const page = req?.body?.page ? parseInt(req?.body?.page) : 0;
    const recordsPerPage = req?.body?.records ? parseInt(req?.body?.records) : 20;
    const query = techStack.length ? { techStack: { $in: techStack }, endDate: { $gt: new Date() } } : {};
    const response = await db.collection(collections.project).find(query).sort({ endDate: 1 }).skip(page * recordsPerPage).limit(recordsPerPage).toArray();
    console.log("Projects matching employee tech stack:", response);
  } catch (e) {
    console.error("Error fetching projects:", e);
  }

}

module.exports = {
  setProjectDetails,
  getProjectDetails,
  createFakeProjects,
  countProjectDocuments,
  getProjects
};
