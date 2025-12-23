const { db }= require('../../db/db.connection')
const { collections, constructSchemaError, generateUUID } = require('../../utils');
const { faker } = require('@faker-js/faker');

const setEmployeeDetails = async (req, res) => {
  let record = {
    employeeID: 'f837eb08-9939-4b05-b297-628296bf02ce',
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
      console.log('testing insert!!',insertStatus)   
      res.status(200).send(insertStatus);
  }catch(e){
    // assume 121 as schema validation error
    console.log("employee creation error", e);
    
  if (error.code === 11000) {
      console.error('Duplicate employeeID detected:', error.keyValue.employeeID);
      res.status(500).send('Employee ID already exists. Please use a unique ID.');
  }
  if(e.code === 121){   
    console.log(constructSchemaError(e));
    res.status(400).send(constructSchemaError(e));  
  }
      
  }

  
};
const getEmployeeDetails = async (req, res, next ) => {
  console.log(next);
  const employeee = await db.collection(collections.employee).findOne({employeeID: req.params.id});
  res.status(200).send(employeee);
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

getFilterSearchEmployee = async (req, res) => {
  // mock request
  //body = {techStack: String, experience: number}
  try{
    // if(req.techStack){
      //const response = await db.collection(collections.employee).find({techStack: {$elemMatch: {$eq: 'react'}}});
      // $in if any of the techs should match (or)
      // $all if all of tech stacks match (and)
      const query = {$and: [{techStack: {$in: ['react', 'azure']}}, {experience: {$gt : 10}}, 
      {name : {$regex: 'Loren', $options: 'i'}}]};
      const response = await db.collection(collections.employee).find(query);      
      const data =  await response.toArray();
      console.log("find employee response", data);
      console.log("find employee response length", data.length);
      //res.status(200).send(data);
    //}
  }catch(e){
    console.error(e);
     //res.status(500).send(e);
  } 
}


getRandomEmployeeIds = async () => {
  try{
    const response = await db.collection(collections.employee).aggregate([{ $sample: { size: 59 } }, { $project: { employeeID: 1, _id: 0 } }]);
    const data =  await response.toArray();
    const employeeIds = data.map(emp => emp.employeeID);
    return employeeIds;
  }catch{
    return [];
  }
}


module.exports = { getEmployeeDetails, setEmployeeDetails, createFakeEmployees, getFilterSearchEmployee, getRandomEmployeeIds };
