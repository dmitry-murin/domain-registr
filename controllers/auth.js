const express = require('express');

module.exports = (authService,promiseHandler) => {
    const router = express.Router();

    router.post('/register',(req, res) =>
    {
        promiseHandler(res,
        authService.register(req.body.form),
        req.headers['content-type']);
     });
    router.post('/login', (req, res) =>
    {
        promiseHandler(res,
        authService.login(req.body.form)
        .then(token=>{
             res.cookie('x-access-token',token);
            return {success: "user login"}
        }),
        req.headers['content-type']);
    });
    router.get('/logout',(req, res) =>
    {
        res.cookie('x-access-token',"");
        res.json({ success: "user logout"});
    });
    return router;
}