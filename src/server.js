const express = require('express');

const server = express();
server.use(express.json());

server.get('/',(request,response)=>{
    response.send();
})
require('./controllers/authController')(server)

server.listen(3000)