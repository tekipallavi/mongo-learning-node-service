const jwt = require('jsonwebtoken');

const authenticator = (req, res, next) => {
    console.log(req.headers['authorization']);
    if(req.headers['authorization'] !== 'testToken'){
        return  res.status(401).send('Unauthorized');
    }
    next();
}

const generateJWTToken = () => {
    const token = jwt.sign(
        { userId: 'test' },
        'aposdjioashdoiasjdioasjdoiasjdoiasjdoiasjdoiasjdoiasjdoiasjdoiasjdoiasjdoiasjdoi', // secret key
        { expiresIn: '24h' }
    );
    return token;
}

const addTokenTORequest= (req, res, next) => {
    const token = generateJWTToken();
    req.headers['authorization'] = `testTokn`;
    next();
}

module.exports = {
    generateJWTToken,
    authenticator,
    addTokenTORequest
};