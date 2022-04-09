const Message = require('../models/Message')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class MessageController {
    static async myMessage(require, response) {
        const userId = require.session.userid

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Message,
            plain: true,
        })

        const messages = user.Messages.map((result) => result.dataValues)

        console.log(messages)

        //check if user exists
        if(!user) {
            response.redirect('/login')
        }

        let emptyMessage = false

        if (messages.length === 0) {
            emptyMessage = true
        }

        response.render('message/myMessage', { messages, emptyMessage })
    }

    static createMessage(require, response) {
        response.render('message/create')
    }

    static async createMessageSave(require, response) {
        const message = {
            title: require.body.title,
            UserId: require.session.userid
        }

        try {
            await Message.create(message)

            require.flash('message', 'Mensagem criada com sucesso!')

            require.session.save(() => {
                response.redirect('/message/myMessage')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async showMessage(require, response) {
        const messagesData = await Message.findAll({
            include: User,
        })

        const messages = messagesData.map((result) => result.get({ plain: true }))

        response.render('message/home', { messages })
    }

    static removeMessage(require, response) {
        const id = require.body.id

        Message.destroy({ where: { id: id } })
        .then(() => {
          require.flash('message', 'Removido com sucesso!')
          require.session.save(() => {
            response.redirect('/message/myMessage')
          })
        })
        .catch((err) => console.log())
    }

    static async editMessage(require, response) {
        const id = require.params.id

        const message = Message.findOne({ where: { id: id }, raw: true })

        response.render('message/edit', { message })
    }

    static async editMessageSave(require, response) {
        const id = require.body.id

        const message = {
            title: require.body.title
        }

        try {
            await Message.update(message, { where: { id: id } })
            require.flash('message', 'Mensagem atualizada com sucesso!')

            require.session.save(() => {
                response.redirect('/message/myMessage')
            })
        } catch (error) {
            console.log(error)
        }

    }
}