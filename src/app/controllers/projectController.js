const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use('/',authMiddleware)
router.get('/', (request, response) => {
    response.send({ ok: "OK" });
});

module.exports = server => server.use('/project', router);
