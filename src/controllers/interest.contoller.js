const { client, db } = require('../../db/db.connection');
const { collections } = require('../../utils');
const  { getRandomEmployeeIds } = require('./employee.controller');
const { getRandomProjects } = require('./project.controller');
const { faker}  = require('@faker-js/faker');

const createInterest = async (projectId, employeeId) => {
    const session = client.startSession();
    session.startTransaction();

    try {
        await db.collection(collections.interest).insertOne({ projectId, employeeId, statusId: 1, timestamp: new Date() }, { session });

        await db.collection(collections.project).updateOne({ projectId }, { $addToSet: { interests: `INT/${projectId}/${employeeId}` } }, { session });

        await db.collection(collections.employee).updateOne({ employeeID: employeeId }, { $addToSet: { interests: `INT/${projectId}/${employeeId}` } }, { session });

        const result = await session.commitTransaction();
        console.log("transaction result", result);
    } catch (e) {
        session.abortTransaction(); // its mandatory to abort when failed 
        console.log('transaction failed', e);
    } finally {
        session.endSession();
        console.log("In finally - ending session")
    }
}

const getInterestsForEmployee = async (employeeId) => {
    const interests = await db.collection(collections.interest).aggregate([
        {
            $match: {
                employeeId
            }
        },
        {
            $lookup: {
                from: collections.project,
                localField: 'projectId',
                foreignField: 'projectId',
                as: 'projectInterests'
            }
        }, 
        {
            $unwind: '$projectInterests'
        },
        {
            $project: {
                "projectName": "$projectInterests.projectName",
                "statusId": 1
            }
        }
    ])
    let results = await interests.toArray();
    console.log("aggregated interests", results);
}



generateInterestsForRandomEmployees = async () => {
  // I will give set of project Ids - now the employee can make interests for multiple projects but he cannot make interest for the same project again.
  try{
    const employeeIds = await getRandomEmployeeIds();
  const projectIds = await getRandomProjects();
    for(const empId of employeeIds){
        // I need random count between 10 to 15
        const interestedProjectsCount = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
        const selectedProjectIds = faker.helpers.arrayElements(projectIds, interestedProjectsCount);
        for(const projId of selectedProjectIds){
            await createInterest(projId, empId);
        }  
    }
  }catch(e){
    console.error("error generating interests for random employees", e);
  }
  
}
module.exports = { createInterest, getInterestsForEmployee, generateInterestsForRandomEmployees }