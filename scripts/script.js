const {db, client} = require('../db/db.connection');
const {createProject} = require('./project-script');

const getConnection = async () =>{
    await client.connect();
}

const executeScript = () => {
    createProject()
}


getConnection();
executeScript();


