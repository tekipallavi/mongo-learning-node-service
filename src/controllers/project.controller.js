const { db }= require('../../db/db.connection')
const { collections, constructSchemaError, generateUUID } = require('../../utils');

const setProjectDetails = async (req, res) => {
  const record = {};
  try{
      const insertStatus = await db.collection(collections.project).insertOne(record);      
      //res.status(200).send("Working");
  }catch(e){
    // assume 121 as schema validation error
    if(e.code === 121){     
     // res.status(400).send(constructSchemaError(e));  
    }
      
  }

  
};

const getProjectDetails = async (req, res) => {
  res.send("Working");
}

module.exports = { setProjectDetails, getProjectDetails };
