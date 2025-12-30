const { db } = require('../db/db.connection');
const { collections } = require('../utils');

async function explainAggregation(collection, pipeline, opts = {}) {
    const { verbosity = 'executionStats', allowDiskUse = false, maxTimeMS } = opts;
    const cursor = collection.aggregate(pipeline, { allowDiskUse, maxTimeMS });
    return await cursor.explain(verbosity);
}

//query-1

const query1 = async () => {
    try {
        const result = await db.collection(collections.interest).aggregate([
            {
                $lookup: {
                    from: collections.employee,
                    localField: 'employeeId',
                    foreignField: 'employeeID',
                    as: 'employee'
                }
            },
            { $unwind: "$employee" },
            {
                $match: { "employee.experience": { $gte: 3 } }
            },
            {
                $lookup: {
                    from: collections.project,
                    localField: 'projectId',
                    foreignField: 'projectId',
                    as: 'project'
                }
            },
            { $unwind: "$project" },
            {
                $addFields: {
                    avgTechOverlap: {
                        $divide: [{ $size: { $setIntersection: ["$employee.techStack", "$project.techStack"] } }, { $size: "$project.techStack" }]

                    }
                }
            },
            { $project: { 'projectId': 1, 'employeeId': 1, 'avgTechOverlap': 1, 'project.projectId': 1, 'employee.employeeID': 1, 'statusId': 1, "employee.techStack": 1, "project.techStack": 1 } },
            {
                $group: {
                    _id: '$employee.employeeID',
                    interests: { $push: '$$ROOT' },
                    techStack: { $first: '$$ROOT.employee.techStack' },
                    totalInterests: { $sum: 1 },
                    acceptedInterests: {
                        $push: {
                            $cond: {
                                if: { $eq: ['$statusId', 2] },
                                then: { techOverlap: { $divide: [{ $size: { $setIntersection: ['$$ROOT.employee.techStack', '$$ROOT.project.techStack'] } }, { $size: '$$ROOT.project.techStack' }] } },
                                else: '$$REMOVE'
                            }
                        }
                    },
                    totalInterestsAvgTechOverlap: {
                        $avg: '$$ROOT.avgTechOverlap'
                    },
                    avgAcceptedTechOverlap: {
                        
                                $avg: {
                                   
                                        $cond: {
                                            if: { $eq: ['$statusId', 2] },
                                            then: { $divide: [{ $size: { $setIntersection: ['$$ROOT.employee.techStack', '$$ROOT.project.techStack'] } }, { $size: '$$ROOT.project.techStack' }]},
                                            else: null
                                        }
                                    

                                }
                            

                    }
                }

            },

        ]).toArray();

        console.log(result);
    } catch (error) {
        console.error('Error in query1:', error);
        throw error;
    }
}

/*
const empPerformMetricsv2 = async() => {
    try {
        const result = await db.collection(collections.interest).aggregate([
            {$lookup: {
                from: collections.employee,
                localField: 'employeeId',
                foreignField: 'employeeID',
                as: "employee"
            }},
            {$unwind: '$employee'},
            {$match: {"employee.experience": {$gte: 3}}},
            {$lookup: {
                from : collections.project,
                localField: 'projectId',
                foreignField: 'projectId',
                as: 'project'
            }},
            {$unwind: '$project'},
            {$project: {
                employeeId: 1,
                _id: 0,
                "employee.techStack": 1,
                "project.techStack": 1,
                "employee.name": 1
            }},
            {$addFields: {
                matchPercent: {
                    $cond: {
                        if: {$gt: [{$size: "$project.techStack"}, 0]},
                        then: {$divide: [
                            {$size: {$setIntersection: ["$project.techStack", "$employee.techStack"]}},
                            {$size: "$project.techStack"}
                        ]}, 
                        else: 0
                    }
                }
            }},
            {$group: {
                _id: "$employeeId",
                name: {$first: "$employee.name"},
                avgTechOverlap: {$avg: "$matchPercent"}
            }}
        ]).toArray();

        console.log(result);
    } catch (e) {
        console.error(e);
    }
} */
module.exports = { query1 }