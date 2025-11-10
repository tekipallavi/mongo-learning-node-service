const {db} = require('../db/db.connection');


const createProposal = async () => {
    try {
       const collection = await db.createCollection("Proposal", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['proposalId', 'projectId', 'employeeId', 'submittedDate', 'statusId', 'versions'],
                    properties: {
                        proposalId: {
                            bsonType: 'string',
                            description: 'Unique identifier for the proposal'
                        },
                        projectId: {
                            bsonType: 'string',
                            description: 'Identifier for the associated project'
                        },
                        projectName: {
                            bsonType: 'string',
                            description: 'Name of the project'
                        },
                        techStack:{
                            bsonType: 'array',
                            uniqueItems: true,
                            enum: ['angular', 'javascript', 'react', 'nodejs', 'azure', '.net'],
                            description: 'Array of technologies required for the project; must be from the predefined list'
                        },
                        submittedDate: {
                            bsonType: 'date',
                            description: 'Date when the proposal was submitted'
                        },
                        statusId: {
                            bsonType: 'number',
                            enum: [1, 2, 3, 4],
                            description: 'Numeric status code representing proposal state (1=open, 2=reviewed, 3-selected, 4-rejected)'
                        },
                        employeeId: {
                            bsonType: 'string',
                            description: 'Identifier for the employee who submitted the proposal'
                        },
                        versions:{
                            bsonType: 'array',
                            minItems: 1,
                            maxItems: 50,
                            uniqueItems: true,
                            items: {
                                bsonType: 'string',
                                description: 'Version details of the proposal'
                            },                            
                            description: 'Array of versions for the proposal, each with its own details'
                        },
                        comments:{
                            bsonType: 'array',
                            uniqueItems: true,
                            minItems:0,
                            items: {
                                bsonType: 'string',
                                description: 'Comments related to the proposal'
                            },
                        }
                    }
                }
            }
        })
        console.log('Proposal collection created with schema validation.', collection.collectionName);
    }catch(e){
        if(e.codeName === 'NamespaceExists'){
            console.error('Proposal collection already exists');  
        }else{
            console.error('Error creating Proposal collection:', e.message);
        }
    }
}

module.exports = {createProposal};