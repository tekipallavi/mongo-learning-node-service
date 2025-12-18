const { db } = require('../db/db.connection');
const { collections } = require('../utils');

async function explainAggregation(collection, pipeline, opts = {}) {
  const { verbosity = 'executionStats', allowDiskUse = false, maxTimeMS } = opts;
  const cursor = collection.aggregate(pipeline, { allowDiskUse, maxTimeMS });
  return await cursor.explain(verbosity);
}

const empPerformMetricsv2_me = async () => {
    try {
        const result = await db.collection(collections.employee).aggregate([
            { $match: { experience: { $gte: 3 } } },
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
                    avgTechOverlap: {$ifNull: [{ $avg: "$projectTechStack.matchPercent"}, 0]}
                }
            },
            {$project: {employeeID:1, name:1, techStack:1, avgTechOverlap:1, projectIntrestsCount:1}}

        ]).toArray();
        console.log("Employee performance metrics v2", result);
    } catch (e) {
        console.error(e);
    }

}

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
}

const employeeExecutionStats = async () => {
    try {

        const pipeline = [
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
                    avgTechOverlap: {$ifNull: [{ $avg: "$projectTechStack.matchPercent"}, 0]}
                }
            },
            {$project: {employeeID:1, name:1, techStack:1, avgTechOverlap:1, projectIntrestsCount:1}}

        ];
        
        const explanation = await explainAggregation(db.collection(collections.interest), pipeline, { verbosity: 'executionStats' });
        console.log(JSON.stringify(explanation, null, 2));
    } catch (e) {
        console.error(e);   
    }
}

module.exports = { empPerformMetricsv2: empPerformMetricsv2 }