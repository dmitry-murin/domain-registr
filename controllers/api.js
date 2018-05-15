const express = require('express');
const EasyXml = require('easyxml');

const serializer = new EasyXml({
    singularize: true,
    rootElement: 'response',
    dateFormat: 'ISO',
    manifest: true
});

module.exports = (userService, authService, domainService) => {
    const router = express.Router();
    const userController = require('./user')(userService, promiseHandler);
    const authController = require('./auth')(authService, promiseHandler);
    const domainController= require('./domain')(domainService, promiseHandler);
   

    router.use('/user', userController);
    router.use('/auth', authController);
    router.use("/domain", domainController);

    return router;
};

function promiseHandler(res, promise, typeReq) {
    console.log(typeReq);
    promise
        .then((data) => {
            switch(typeReq)
            {
                case "application/json": res.json(data); break;
                case "application/xml": {
                    res.header('Content-Type', 'text/xml');
                    res.send(serializer.render(data));
                    break};
                default: res.json(data); break;
            }
        })
        .catch((err) => res.error(err));
}
