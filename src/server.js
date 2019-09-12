const express = require('express');

const server = express();
server.use(express.json());

require('./app/controllers/authController')(server)
require('./app/controllers/projectController')(server)

server.get('/',(request,response)=>{
    response.send();
})

server.listen(3000)