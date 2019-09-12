const mailer = require('nodemailer');
const mailerConfig = require('./mail');
const handleBars = require('nodemailer-express-handlebars')
const path = require('path')
const { host, user, pass, port } = mailerConfig
var transport = mailer.createTransport({
    host:'smtp.mailtrap.io',
    port:2525,
    auth: {
        user:'0089dc1adfee86',
        pass:'7faa4d690ac1dd',
    },
    
});

transport.use('compile',handleBars({
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./src/resources/mail/partials'),
        layoutsDir: path.resolve('./src/resources/mail'),
        defaultLayout: 'forgot_password.html',
      },
    viewPath: path.resolve('./src/resources/mail'), 
    extName:'.html'
}))


module.exports = transport 