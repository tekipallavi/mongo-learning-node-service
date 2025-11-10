const {client} = require('../db/db.connection');
const {createProject} = require('./project-script');
const {createProposal} = require('./proposal-script');
const {createInterest} = require('./interests-script');

const getConnection = async () =>{
    await client.connect();
}

const executeScript = () => {
   // createProject();
   // createProposal();
   createInterest();
}


getConnection();
executeScript();


