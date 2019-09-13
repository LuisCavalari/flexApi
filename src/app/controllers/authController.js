const express = require('express');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mail')
const router = express.Router();

function generateToken(user = {}) {
    return jwt.sign(user, authConfig.secret, {
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
            token: generateToken({ id: user.id }),
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
    
    const token = generateToken({ id: user.id })

    response.send({ user, token })

})

router.post('/forgot_password', async (request, response) => {
    const { email } = request.body
    try {
        const user = User.findOne({ email });

        if (!user)
            return response.status(400).send({ error: 'Invalid email' })

        const token = crypto.randomBytes(20).toString('hex');

        const dateNow = new Date();

        dateNow.setHours(dateNow.getHours() + 1);

        await User.findOneAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpire: dateNow
            }
        })

        mailer.sendMail({
            to: email,
            from: 'lfelipe.felipe4@gmail.com',
            template: 'forgot_password',
            context: { token }
        }, (err) => {
            if (err)
                response.status(400).send('Error on email sending')
            console.log(err)


        })
        console.log(token, dateNow)

    } catch (error) {
        console.log(error)
        return response.send({ erro: 'Error on forgot password' })
    }
})

router.post('/reset_password', async (request, response) => {
    const { email, token, password } = request.body
    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpire');
        const dateNow = new Date();
        if (!user)
            response.status(400).send({ error: 'Invalid email' })

        if (user.passwordResetToken != token)
            response.status(400).send({ error: 'Invalid token' });

        if (user.passwordResetExpire < dateNow)
            response.status(400).send({ error: 'Expired token' })

        user.password = password

        await user.save()

        response.send({ message: 'The password has been changed ' })

    } catch (error) {

    }
});




module.exports = server => server.use('/auth', router)