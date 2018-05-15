console.log(process.env.type);
global.isProd = process.env.type=="production";
console.log(isProd);
module.exports = (Sequelize, config) => {
    const options = {
        host: isProd?config.db_heroku.host:config.db.host,
        dialect: isProd?config.db_heroku.dialect:config.db.dialect,
        logging: false,
        port :isProd?config.db_heroku.port:config.db.port,
        //dialectOptions:{ ssl:true}
    };
    console.log(options);
    const sequelize = new Sequelize(isProd?config.db_heroku.name:config.db.name,
                                    isProd?config.db_heroku.user:config.db.user,
                                    isProd?config.db_heroku.password:config.db.password,
                                    options);
    
    const Domain= require('../models/domain')(Sequelize, sequelize);
    const User = require('../models/user')(Sequelize, sequelize);

    User.hasMany(Domain);
    Domain.belongsTo(User);
    
    return {
        domain: Domain,
        user: User,

        sequelize: sequelize
    }
}
