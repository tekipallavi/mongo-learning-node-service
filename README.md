# mongo-learning-node-service

Project requirement
I want to do a project called RFP portal (request for proposal).
1. Every new project enrolled can request for a proposal.
2. Every registered employee can show interest for a proposal. 
3. Admin can select employees based on some criteria and accept their interest to submit proposal
4. Only accepted employees can submit proposal
5. Admin can select a proposal

Employee:
- Employee can see all proposals that has atleast one skill that matches with atleast one skill the project demands
- Proposals can be filtered based on status of proposal
- Employee can show interest on multiple proposals and should receive acceptance on his interest.
- Employee should see all his interests and their status
- submit proposal to multiple projects




Proposal: (src)
- proposalId - string , unique
- projectId - string
- projectName - string
- techStack - array - add enum, unique items
- submittedDate - date 
- statusId - reviewed, open, selected, rejected  [0,1,2,3]
- employeeId - string 
- verions -  array of strings , unique items [ v1, v2, v3]
-comments - array of strings, unique or []

version collection: (src2)
- version id - string
- description - string
- timestamp - timestamp
- proposal ID - string


Employee (required - employeeId, employeeName, tech stack) (src2)
- EmployeeId - string
- employeeName - string
- techStack - array of strings - no enum
- Experience - decimal  |  null
- Proposals - array of strings (proposalId), unique  | []
- Interests - array of strings (projectId), unique || []


Interests (all required) (src)
- Project ID - string
- Employee Id - string
- Status - open, selected, rejected ,  number , enum - [0,1,2]
- Timestamp - Timestamp

Project: [Not required - proposals, interests, accepted proposals]
- Project Id
- Project name
- Client name
- Tech stack
- Project status (open for interests,  open for proposals, pending evaluation, Accepted, rejected )
- ProjectStatusId
- Interests - [employee Id]
- selectedInterests - - [employee Id]
- Proposals - [ProposalIds]
- Accepted proposal - Id
- startDate
- endDate

// Need to check if an employee collection has proposal Id that is present in proposals collection

// Requirement


create employee API
- required attributes ?
- min one tech stack is required


Project create API
- required attributes
- set default status to open for interests


Proposal create API 
- projectId should exists in current project collection
- employee id should exist in current employee collection
- tech stack should be a subset of project tech stack
- set default status to open