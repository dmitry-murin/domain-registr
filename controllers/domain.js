const express = require('express');
var jwt = require('jsonwebtoken');

module.exports = (domainService, promiseHandler) => {
    const router = express.Router();

    router.get('/check',(req, res) =>
    {
        promiseHandler(res,
        domainService.checkDomain(req.query.domain),
        req.headers['content-type']);    
    });
    router.post('/',(req, res) =>
    {
        promiseHandler(res,getId(req.cookies["x-access-token"])
        .then(id=>domainService.registr(req.body.form.domain, req.body.form.ip, id)),
        req.headers['content-type']);
    });
    router.post('/pay',(req, res) =>
    {
        promiseHandler(res,getId(req.cookies["x-access-token"])
        .then(id=>domainService.pay(req.body.form.id, id)),
        req.headers['content-type']);
    });
    router.post('/getxml',(req, res) =>
    {
        console.log(req.body.domain);
        res.send("OK");
    });
    function getId(token)
    {
        return new Promise((resolve, reject) => {
            var decoded = jwt.verify(token, 'pskpdm');
            resolve(decoded.__user_id);
        });
    }
    return router;
}