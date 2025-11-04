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




Proposal:
- Proposal Id
- Project Id
- Project name
- Tech stack
- Timeline
- Status
- submitted employee Id
- verions : [ v1, v2, v3]

version collection:
- version id
- description
- timestamp
- proposal ID
- comments

Employee
- EmployeeId
- Employee Name
- Tech stack
- Experience
- Proposals 
- Interests


Interests
- Project ID
- Employee Id
- Status
- Timestamp

Project:
- Project Id
- Project name
- Client name
- Tech stack
- Project status (open for interest, pending interests,  open for proposals, pending evaluation, Accepted, rejected )
- Interests
- selectedInterests
- Proposals
- Accepted proposal

