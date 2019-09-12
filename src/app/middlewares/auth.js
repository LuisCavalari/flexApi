const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports = (request, response, next) => {
    const authHeader = request.headers.authorization
    if (!authHeader)
        return response.status(401).send({ error: 'No token provided' })
    const parts = authHeader.split(' ');
    if (parts.length != 2)
        return response.status(401).send({ error: 'Invalid token' })

    const [schema, token] = parts;

    if (!/^Bearer$/i.test(schema))
        return response.status(401).send({ error: 'Token badformat' })

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err)
            return response.status(401).send({ error: 'Invalid Token' })
        request.userId = decoded.id
        next()
    });
}