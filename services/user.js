var bcrypt = require('bcryptjs');
const saltRounds = 10;
const Promise = require('bluebird');
module.exports = (userRepository, errors) => {
    return {
        updateUser: updateUser,
        readAllUser:readAllUser,
        deleteUser: deleteUser,
        readUser:   readUser
    };
    function updateUser(id,idUser,data){
        return new Promise((resolve, reject) => {
            if(id!=idUser) return reject(errors.accessDenied)
            else {
                bcrypt.hash(data.password, saltRounds, function(err, hash) {
                    if (err) {
                        throw err;
                    }
                    userRepository.update({password:hash},{where: {id: id}})
                    .then(data=>resolve({success: true}))
                    .catch(error=>reject(error));
                })
            }
        })
    }
    function readAllUser()
    {
        return new Promise((resolve, reject) => {
            userRepository.findAll({attributes: ['id','login']})
            .then(users=>resolve({success:true, data:{users: users}}))
            .catch(error=> reject(error));
        });
    }
    function readUser(id, idUser)
    {
        return new Promise((resolve, reject) => {
            var param=['id','login','money','createdAt'];
            if(id==idUser) param.push('money');
            userRepository.findById(idUser,{attributes: param})
            .then(user=>resolve({success: true, data:{user: user}}))
            .catch(error=>reject(error));
        })
    }
    function deleteUser(id, idUser)
    {
        return new Promise((resolve, reject) => {
            if(id!=idUser) throw (errors.accessDenied)
            else{
                userRepository.destroy({where:{id:id}})
                .then(data=>resolve({success: true}))
                .catch(error=>reject(error));
            }
        })
    }
};
