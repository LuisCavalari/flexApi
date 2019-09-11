const express = require('express');

const server = express();


server.use(express.json());

server.get('/',(request,response)=>{
    response.send();
})

server.listen(3000)