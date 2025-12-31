const { db, client } = require('../db/db.connection');
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
                                then: { $divide: [{ $size: { $setIntersection: ['$$ROOT.employee.techStack', '$$ROOT.project.techStack'] } }, { $size: '$$ROOT.project.techStack' }] },
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


//query3
const query3 = async () => {
    try {
        const result = await db.collection(collections.project).aggregate([
            // match the projects that have end Date within next 6 months
            { $match: { endDate: { $gte: new Date(), $lte: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000) } } },
            {
                $lookup: {
                    from: collections.interest,
                    let: { pid: '$projectId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$projectId', '$$pid'] } } },
                    ],
                    as: 'interestData'
                }
            },
            {
                $addFields: {
                    interestCount: { $size: '$interestData' },
                    //push the statusId of each interest in interestData array
                    selectedInterestCount: { $size: { $filter: { input: '$interestData', as: 'i', cond: { $eq: ['$$i.statusId', 2] } } } }
                }
            },
            // calculate the selection rate
            {
                $addFields: {
                    selectionRate: {
                        $cond: {
                            if: { $gt: ['$interestCount', 0] },
                            then: { $divide: ['$selectedInterestCount', '$interestCount'] },
                            else: 0
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    projectId: 1,
                    projectName: 1,
                    interestCount: 1,
                    selectedInterestCount: 1,
                    selectionRate: 1
                }
            }

        ]).toArray();
        console.log(result);
    } catch (e) {
        console.error(e);
    }
}

const query4 =  async () => {
    const projectId = 'ef77ea26-e036-4d49-945c-438b1751b001';
    const session = client.startSession();
    await db.collection(collections.project).findOneAndUpdate({projectId}, {$unset: {'selectedInterests': []}}, {session});
    try {
        session.startTransaction();
        const interests = (await db.collection(collections.interest).find({projectId}, {session}).toArray()).filter((i, idx) => idx%2);
        const employeeIds = interests.map(i => i.employeeId);
        console.log(employeeIds);
        // update the status of all interests that have this projectId and employeeId in employeeIds array to 2
        const interestResult = await db.collection(collections.interest).updateMany({projectId, employeeId: {$in: employeeIds} }, {$set: {statusId: 2}}, {session});
        const projectResult = await db.collection(collections.project).updateOne({projectId}, {$addToSet: {selectedInterests: {$each: employeeIds}}}, {session});
        await session.commitTransaction();
    } catch (e) {
        console.error(e);
    } finally {
        session.endSession();
    }
}
module.exports = { query1, query3, query4 }