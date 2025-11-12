const { db }= require('../../db/db.connection')
const { collections, constructSchemaError, generateUUID } = require('../../utils');
const { faker } = require('@faker-js/faker');

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
      const insertStatus = await db.collection(collections.employee).insert(record);   
      console.log(insertStatus)   
      //res.status(200).send("Working");
  }catch(e){
    // assume 121 as schema validation error
    if(e.code === 121){   
      console.log(constructSchemaError(e));
     // res.status(400).send(constructSchemaError(e));  
    }
      
  }

  
};

const getEmployeeDetails = async (req, res) => {
  res.send("Working");
}

const createFakeEmployees = async () => {  
  let fakerecords  = [];
  for(i = 0; i< 50; i++){
    fakerecords.push({
    employeeID: generateUUID(),
    name: faker.person.fullName(),
    techStack: Array.from({length: 2}, () => faker.helpers.arrayElement([ "angular","javascript","react","nodejs","azure", ".net",])),
    experience: faker.number.float({ min: 1, max: 30, fractionDigits: 1 }),
    proposals: [],
    interests: [],
  });
  }
   try{    
      const insertStatus = await db.collection(collections.employee).insertMany(fakerecords);      
      console.log(insertStatus);
  }catch(e){
    // assume 121 as schema validation error
    if(e.code === 121){     
      console.log("error faking emoloyee!!", e.writeErrors[0]);
    }
      
  }
}

module.exports = { getEmployeeDetails, setEmployeeDetails, createFakeEmployees };
