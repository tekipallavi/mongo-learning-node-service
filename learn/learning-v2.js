const { db } = require('../db/db.connection');
const { collections } = require('../utils');

const empPerformMetricsv2 = async () => {
    try {
        const result = await db.collection(collections.employee).aggregate([
            { $match: { experience: { $gte: 3 } } },
            { $addFields: { projectIntrestsCount: { $size: "$interests" } } },
            {
                $lookup:
                {
                    from: collections.interest,
                    localField: 'employeeID',
                    foreignField: 'employeeId',
                    as: 'interestDetails'
                }
            },
            { $addFields: { projectIds: { $map: { input: "$interestDetails", as: "interest", in: "$$interest.projectId" } } } },
            //{$lookup: {from :collections.project, localField: 'projectIds', foreignField: 'projectId', as: 'projectDetails'}},
            {
                $lookup:
                {
                    from: collections.project,
                    let: { pIds: "$projectIds", eTechStack: '$techStack' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$projectId', '$$pIds'] } } },
                        { $project: { _id: 0, techStack: 1 } },
                        //{$addFields: {techStackIntersection: {$size:{$setIntersection: ['$techStack', '$$eTechStack']}}}},
                        {
                            $addFields: {
                                matchPercent:
                                {
                                    $cond: [
                                        { $gt: [{$size: '$techStack'}, 0] },
                                        { $divide: [{ $size: { $setIntersection: ['$techStack', '$$eTechStack'] } }, {$size: '$techStack'}] },
                                        0
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'projectTechStack'
                }
            },
            {
                $addFields: {
                    interSection: { $avg: "$projectTechStack.matchPercent"}
                }
            }

        ]).toArray();
        console.log("Employee performance metrics v2", result);
    } catch (e) {
        console.error(e);
    }

}

module.exports = { empPerformMetricsv2 }