const {client, db} = require('../../db/db.connection');
const { collections } = require('../../utils');

const createInterest = async (projectId, employeeId) => {
    const session = client.startSession();
    session.startTransaction();

    try{
        await db.collection(collections.interest).insertOne({projectId, employeeId, statusId: 1, timestamp: new Date()}, {session});

        await db.collection(collections.project).updateOne({projectId}, {startDate: 'pallavi'}, {session});

        await db.collection(collections.employee).updateOne({employeeID: employeeId}, {$addToSet: {interests: `INT/${projectId}/${employeeId}`}}, {session});

        const result = await session.commitTransaction();
        console.log("transaction result", result);
    }catch(e){
        session.abortTransaction(); // its mandatory to abort when failed 
        console.log('transaction failed', e);
    }finally {
        session.endSession();
        console.log("In finally - ending session")
    }
}

const getInterestsForProject = async (projectId) => {
   
}
module.exports = {createInterest}