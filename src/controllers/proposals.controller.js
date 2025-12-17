
const { db } = require("../../db/db.connection");
const {
  collections,
  generateUUID,
} = require("../../utils");
const { faker } = require("@faker-js/faker");

const createProposal = async (req, res) => {
  try {
    const proposal = {
      proposalId: generateUUID(),
      projectId: req.body.projectId,
      projectName: req.body.projectName,
      techStack: req.body.techStack,
      submittedDate: new Date(),
      statusId: 1,
      employeeId: req.body.employeeId,
      versions: req.body.versions || [],
      comments: req.body.comments || [],
    };

    const result = await db
      .collection(collections.PROPOSAL)
      .insertOne(proposal);

    res.status(201).json({
      message: "Proposal created successfully",
      proposalId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



const createRandomProposals = async (numProposals) => {
  for (let i = 0; i < numProposals; i++) {
    const pool = ["angular","javascript","react","nodejs","azure",".net"];
    const len = Math.floor(Math.random() * 3) + 1; // 1..3
    const techStack = faker.helpers.arrayElements(pool, len); // unique items

    const proposal = {
      proposalId: generateUUID(),
      projectId: '',
      projectName: '',
      techStack: techStack,
      submittedDate: faker.date.recent(30),
      statusId: 1,
      employeeId: '',
      
    };

    createProposal({ body: proposal }, {
      status: (code) => ({
        json: (data) => {
          // Mock response handler
        },
      }),
    });
  }
  console.log(`${numProposals} random proposals created.`);
}