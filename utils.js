const { UUID } = require("mongodb")

const generateUUID = () => {
    return new UUID().toString();
}

const collections = {
    employee: 'employees',
    project: 'Project',
    interest: 'Interest'
}

const constructSchemaError = (e) => {
     return  e.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied.map(({propertyName, description}) => ({propertyName, description}));
}

module.exports = {generateUUID, collections, constructSchemaError};