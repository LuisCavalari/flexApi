const express = require('express');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth');

const router = express.Router();

function generateToken(user = {}) {
    return jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
    });
}
router.post('/register', async (request, response) => {
    try {
        const { email } = request.body;
        if (await User.findOne({ email }))
            response.status(400).send({ error: 'Email already exist' })

        const user = await User.create(request.body);

        user.password = undefined;

        return response.send({
            user,
            token: generateToken({ user }),
        })
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
});

router.post('/authenticate', async (request, response) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user)
        response.status(400).send({ error: 'Invalid email' });

    if (!await bcrypt.compare(password, user.password))
        response.status(400).send({ error: 'Invalid password' });

    const token = generateToken({ user })

    response.send({ user, token })

})


module.exports = server => server.use('/auth', router)