const { db, client } = require('../db/db.connection');
const { collections } = require('../utils');
//Query - 1
const empPerformMetrics = async () => {
    try {
        const result = await db.collection(collections.employee).aggregate([
            {
                $match: {
                    experience: { $gte: 3 },
                }
            },
            {
                $addFields: {
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
    } catch (e) {
        console.error(e);
    }

}

//Query -4 
const selectInterests = async () => {
    const projectId = '8cceacea-86e1-4c83-9f4e-48be6f781608';
    const session = client.startSession();

    try {
        session.startTransaction();
        const employeeIds = (await db.collection(collections.project).find({ projectId }).project({ interests: 1, _id: 0 }).toArray())[0].interests.map(interest => {
            return interest.split('/')[2]
        });
        const selectedEmployeeIds = employeeIds.filter((e, i) => i <= employeeIds.length / 2);
        // employeeIds in selectedEmployees should be unique, so replaced $set to $addToSet
        const projectResult = await db.collection(collections.project).updateOne({ projectId }, { $addToSet: { selectedInterests: { $each: selectedEmployeeIds } } }, { session });
        const interestResult = await db.collection(collections.interest).updateMany({ projectId }, { $set: { statusId: 2 } }, { session })
        const result = await session.commitTransaction();
        console.log("transaction result", result);
    } catch (e) {
        console.log(e);
    } finally {
        session.endSession();
    }
}

const query3 = async () => {
    try {
        const projectIds = ['8cceacea-86e1-4c83-9f4e-48be6f781608', '45fa1692-695e-49f4-bf49-fc756328a1aa', 'a6b901ba-f850-4392-aef0-5643d97d965f', 'a1151e1c-9417-45ae-b9ac-ed429c326cbe'];
        const result = await db.collection(collections.interest).aggregate([
            {
                $match: { $expr: { $in: ['$projectId', projectIds] } }
            },
            {
                $group: {
                    _id: '$projectId',
                    openCount: { $sum: { $cond: [{ $eq: ['$statusId', 1] }, 1, 0] } },
                    selectedCount: { $sum: { $cond: [{ $eq: ['$statusId', 2] }, 1, 0] } },
                    totalCount: { $count: {} },
                    interests: { $push: "$$ROOT" },
                    // unwind each interests objects to get array of documents

                }
            },
            {
                $addFields: {
                    conversionRate: {
                        $cond: { if: { $gt: ['$totalCount', 0] }, then: { $divide: ['$selectedCount', '$totalCount'] }, else: 0 }
                    }
                }
            }
        ])
        console.log("result", (await result.toArray())[0].interests);
    } catch (e) {
        console.error(e);
    }
}

const query5 = async () => {
    const techStacks = [
        "angular",
        "javascript",
        "react",
        "nodejs",
        "azure",
        ".net",
    ]
    try {
        const result = await db.collection(collections.project).aggregate([
            {
                $unwind: '$techStack'
            },
            {
                $group: {
                    _id: '$techStack',
                    count: { $count: {} }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 1
            }
            // check which techStack has max count without sorting

        ]).toArray();
        console.log('result for query5', result)
    } catch (e) {
        console.log(e);
    }
}

const query6 = async () => {
    try {
        const projectId = '8cceacea-86e1-4c83-9f4e-48be6f781608';
        const requiredTechStacks = (await db.collection(collections.project).findOne({ projectId }))?.techStack || [];
        const result = await db.collection(collections.employee).aggregate([
            {
                $match: { $expr: { $gt: [{ $size: { $setIntersection: ['$techStack', requiredTechStacks] } }, 0] } }
            },
            {
                $addFields: {
                    matchPercentage: {
                        $divide: [
                            { $size: { $setIntersection: ['$techStack', requiredTechStacks] } },
                            { $size: [requiredTechStacks] }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: collections.interest,
                    let: { eid: '$employeeID', interests: '$interests' },
                    pipeline: [
                        {
                            $match: { $and: [{ $expr: { $eq: ['$employeeId', '$$eid'] } }, { $expr: { $eq: ['$statusId', 2] } }] }
                        }

                    ],
                    as: 'selectedInterests'
                }
            },
            {
                $addFields: {
                    historyStats: {
                        $divide: [{ $size: ['$selectedInterests'] }, { $cond: { if: { $gt: [{ $size: ['$interests'] }, 0] }, then: { $size: ['$interests'] }, else: 1 } }]
                    }
                }
            }

        ]).toArray();
        console.log(result)
    } catch (e) {
        console.error(e);
    }
}

const query9 = async () => {
    try {
        const result = await db.collection(collections.employee).aggregate([
            {
                $match: {
                    $expr: { $gte: [{ $size: ['$interests'] }, 5] }
                }
            },
            {
                $lookup: {
                    from: collections.interest,
                    let: { eid: '$employeeID' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$$eid', '$employeeId'] }
                            }
                        },
                        {
                            $facet: {
                                selectedInterests: [
                                    { $match: { statusId: 2 } },
                                    {
                                        $group: {
                                            _id: null,
                                            projectIds: { $addToSet: '$projectId' }
                                        }
                                    },

                                    {
                                        $project: { _id: 0, projectIds: 1 }
                                    }
                                ],

                                allProjects: [
                                    {
                                        $group: {
                                            _id: null,
                                            projectIds: { $addToSet: '$projectId' }
                                        }
                                    },

                                    {
                                        $project: { _id: 0, projectIds: 1 }
                                    }
                                ]
                            }
                        },
                        {
                            $project: {
                                allProjectIds: { $ifNull: [{ $arrayElemAt: ['$allInterests.projectIds', 0] }, []] },  // Extract all projectIds (default to empty array if none)
                                selectedProjectIds: { $ifNull: [{ $arrayElemAt: ['$selectedInterests.projectIds', 0] }, []] }  // Extract selected projectIds (default to empty array if none)
                            }
                        }

                    ],
                    as: 'interestSummary'
                }
            },
            {
                $match: { $expr: { $lte: [{ $size: ['$selectedInterests'] }, 1] } }
            }
        ]).toArray();
        console.log(result)
    } catch (e) {

    }
}
module.exports = { empPerformMetrics, selectInterests, query3, query5, query6, query9 }