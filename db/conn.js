const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('message', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('conectamos com sucesso!')
} catch(error) {
    console.log(`Não foi possível conectar: ${error}`)
}

module.exports = sequelize