const express = require('express')
const router = express.Router()
const MessageController = require('../controllers/MessageController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/myMessage', checkAuth, MessageController.myMessage)
router.get('/add', checkAuth, MessageController.createMessage)
router.post('/add', checkAuth, MessageController.createMessageSave)
router.get('/edit/:id', checkAuth, MessageController.editMessage)
router.post('/edit/', checkAuth, MessageController.editMessageSave)
router.post('/remove', checkAuth, MessageController.removeMessage)
router.get('/', MessageController.showMessage)

module.exports = router