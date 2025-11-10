const {db} = require('../db/db.connection');

const createInterest = async () => {
    try{
    const collection = await db.createCollection("Interest", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["projectId", "employeeId", "statusId", "timestamp"],
                properties: {
                    projectId: {
                        bsonType: "string",
                        description: "must be a uniqueId and is required"
                    },
                    employeeId: {
                        bsonType: "string",
                        description: "must be a string and isrequired"
                    },
                    statusId: {
                        bsonType: "number",
                        enum: [1, 2, 3], //open, selected, rejected
                        description: "can only be one of the enum values and is required"
                       
                    },
                    timestamp:{
                        bsonType: "date",
                        description: "must be a date and is required"
                    }
                }            
            }
        }
    });
    console.log("Interest Collection created with validator", collection.collectionName);
    }catch(error){
        if(error.codeName === 'NamespaceExists'){
            console.log("Interest Collection already exists");
        }else {
            console.error("Error creating Interest collection:", error);
        }
    }
}

module.exports = {createInterest};