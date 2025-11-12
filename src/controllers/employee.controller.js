const { db }= require('../../db/db.connection')
const { collections, constructSchemaError, generateUUID } = require('../../utils');

const setEmployeeDetails = async (req, res) => {
  let record = {
    employeeID: generateUUID(),
    name: req.body.name,
    techStack: req.body.techStack,
    experience: req.body.experience,
    proposals: [],
    interests: [],
  }
  if(!record.experience){
    res.status(400).send('Please add a valid experience')
  }
  try{
      const insertStatus = await db.collection(collections.employee).insertOne(record);      
      //res.status(200).send("Working");
  }catch(e){
    // assume 121 as schema validation error
    if(e.code === 121){     
     // res.status(400).send(constructSchemaError(e));  
    }
      
  }

  
};

const getEmployeeDetails = async (req, res) => {
  res.send("Working");
}

module.exports = { getEmployeeDetails, setEmployeeDetails };
