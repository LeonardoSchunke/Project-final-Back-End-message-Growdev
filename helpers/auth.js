module.exports.checkAuth = function (require, response, next) {
    const userid = require.session.userid

    if(!userid) {
        response.redirect('/login')
    }

    next()
}