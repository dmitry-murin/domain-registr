var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
module.exports = (userRepository, errors) => {
    return {
        login: login,
        register: register
    };
    function register(data)
    {
        return new Promise((resolve, reject) => {
           userRepository.findOne({where:{login:data.login}})
            .then(user=>{
                if(user!=null) 
                {
                    throw(errors.wrongCredentials);
                }
                else if(data.login.length<3||data.password.length<3)
                {
                    throw(errors.errorData);
                }
                else {
                    return new Promise((resolve, reject) => {
                        bcrypt.hash(data.password, saltRounds, function(err, hash){
                        if (err) {
                            return reject(err);
                        } 
                        else return resolve(hash);
                    })
                })
            }})
            .then(hash=>{
                return userRepository.create({
                    login: data.login,
                    password: hash,
                    money: 20
                })
            })
            .then(data=>{ resolve({success: true})})
            .catch(data=>reject(data));
        })
    }
    function login(data)
    {
        return new Promise((resolve, reject) => {
            userRepository.findOne({where:{login: data.login},
                                    attributes: ['id','login','password']})
            .then(user=>{
                if(user==null) reject("user not found");
                bcrypt.compare(data.password, user.password , function(err, rez){
                    if (rez==true){
                        resolve(jwt.sign({ __user_id: user.id,
                                            __user_login: user.login}, 'pskpdm'));}
                    else    reject(errors.invalidPassword)
                });
            })
        });
    }
}