var needle = require('needle');
var Promise = require("bluebird");
module.exports = (domainRepository,userRepository, errors, config) => {
    var cost=config.cost;
    return {
        checkDomain: checkDomain,
        registr: registr,
        pay: pay
    };
    function checkDomain(domain) {
        return new Promise((resolve, reject) => {
            if(!(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test(domain))) return reject(errors.errorDomain);
            var options = {
                headers: {  'Origin': 'https://www.namecheap.com/',
                            'Content-Type': 'application/x-www-form-urlencoded' }
            }
            var url='https://api.domainr.com/v2/status?domain=' + domain + '&client_id=fb7aca826b084569a50cfb3157e924ae';
            needle.get(url,options, function(err, resp) {
                if(err) {
                    return reject(errors.errorGetDomainr);
                }
                if((resp.body.status[0].status).indexOf("inactive")>=0)
                {
                    domainRepository.findOne({where: {domain:domain}})
                    .then(data=>{
                        if(data==null) resolve({success: true, data: {status: true}})
                        else resolve({success: true, data: {status: false}});
                    })
                }
                else resolve({success: true, data: {status: false}});
            }); 
        })
    }
    function registr(domain, ip,userId)
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                checkDomain(domain),
                domainRepository.findOne({where:{domain:domain}}),
                domainRepository.findOne({where:{ip:ip}})])
            .spread((checkDomain,rezDomain,rezIp)=>{
                if(rezDomain==null&&rezIp==null&&checkDomain.data.status)
                {
                    domainRepository.create({
                        domain: domain,
                        ip: ip,
                        statusPay: false,
                        userId: userId
                    })
                    .then(data=>resolve({success: true}))
                    .catch(error=>{reject(error)});
                }
                else
                    reject(errors.invalidDomainOrIP);
            })
            .catch(err=>reject(err));
        })
    }
    function pay(id,idUser)
    {
        return new Promise((resolve, reject) => {
            domainRepository.findById(id,{attributes:["userId","statusPay"]})
            .then(dmn=>{
                if(dmn==null||dmn.userId!=idUser) return  reject(errors.errorDomain);
                else if(dmn.statusPay==true) return  reject(errors.alreadyPay);
                else{
                    return userRepository.findById(idUser,{attributes:["id","money"]})
                }
            })
            .then(user=>{
                if(user.money<cost) return  reject(errors.notMoney);
                else
                {
                    Promise.all([
                        user.decrement({money: cost}),
                        domainRepository.update({statusPay: true},{where:{id: id}})])
                    .spread((user,domain)=>{
                        resolve({success: true})
                    })
                }
            })
            .catch((err)=>{
                reject(err)
            });
        })
    }
};