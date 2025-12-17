const { db }= require('../db/db.connection');
const { collections } = require('../utils');

const empPerformMetrics = async () => {
    try{
    const result = await db.collection(collections.employee).aggregate([
    {
        $match: {
            experience: {$gte: 3},
        }
    },
    {
        $addFields:{
            projectInterestsCount: {
                $size: '$interests'
            }
        }
    },
    {
        $lookup: {
            from: collections.interest,
            localField: 'employeeID',
            foreignField: 'employeeId',
            as: 'interestDetails'           
        }
    }, {
    $addFields: {
        projectIds: {
            $map: {
                input: '$interestDetails',
                as: 'interest',
                in: '$$interest.projectId'
            }
        }
    }
}
    
    ]).toArray();
    console.log("employee performance metrics", result);
    }catch(e){
        console.error(e);
    }
  
}

module.exports = { empPerformMetrics }