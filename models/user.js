module.exports = (Sequelize, sequelize) =>{
     return sequelize.define('user', {
         id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login:{
            type: Sequelize.STRING,
            allowNull: false
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false
        },
        money:{
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });
}