var jwt = require('jsonwebtoken');
module.exports = (errors) => {
    return (req, res, next) => {
        if((req.url).indexOf('/auth')==0) next();
        else{
            console.log("OK");
            var p=new Promise((resolve, reject) => {
            jwt.verify(req.cookies["x-access-token"], 'pskpdm', function (err, decoded)
            {
                if(err) 
                {
                    console.log("err");
                    return reject(err);
                }
                else{
                    console.log("ww");
                    return resolve(decoded);
                }
            })
            })
            .then(data=>{
                console.log(data);
                next();
            })
            .catch(err=>{
                console.log(err);
                res.send(errors.accessDenied);
            })
    };
    }
};