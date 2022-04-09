const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Message = db.define('Message', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
})

Message.belongsTo(User)
User.hasMany(Message)

module.exports = Message