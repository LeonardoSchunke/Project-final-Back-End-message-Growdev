const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const port = process.env.PORT || 3000

const app = express()

const conn = require('./db/conn')
const { response } = require('express')

//Modules
const Message = require('./models/Message')
const User = require('./models/User')

// import routes
const messageRoutes = require('./routes/messageRoutes')
const authRoutes = require('./routes/authRoutes')

//templetes engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//Import Controller
const MessageController = require('./controllers/MessageController')

//receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//sessions midleware
app.use(
    session({
        name: 'session',
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'session')
        }),
        cookie: {
            secure: false,
            maxAge:360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

//flash massages
app.use(flash())

//public path
app.use(express.static('public'))

//set sessions to response
app.use((require, response, next) => {
    if (require.session.userid) {
        response.locals.session = require.session
    }

    next()
})

//rotas
app.use('/message', messageRoutes)
app.use('/', authRoutes)

app.get('/', MessageController.showMessage)

conn.sync().then(() => {
        app.listen(port)
    }).catch((error) => console.log(error))