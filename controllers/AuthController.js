const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthenticContoller {
    static login(require, response) {
        response.render('auth/login')
    }

    static async loginPost (require, response) {
        const { email, password } =require.body

        //check email
        const user = await User.findOne({ where: {email: email} })

        if(!user) {
            require.flash('message', 'Usuário não encontrado!')
            response.render('auth/login')
            return
        }

        //check password
        const passwordCheck = bcrypt.compareSync(password, user.password)

        if(!passwordCheck) {
            require.flash('message', 'Senha inválida!')
            response.render('auth/login')
            return
        }

        //efetuar login
        require.session.userid = user.id

        require.flash('message', 'Bem vindo de volta!')

        require.session.save(() => {
            response.redirect('/')
        })
    }

    static register(require, response) {
        response.render('auth/register')
    }

    static async registerPost(require, response) {
        const {name, email, password, confirmPassword} = require.body

        //password match validation
        if(password != confirmPassword) {
            require.flash('message', "As senhas não conferem, tente novamente!")
            response.render('auth/register')
            return
        }

        //check if user exists
        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            require.flash('message', "O e-mail já está cadastrado!")
            response.render('auth/register')
            return
        }

        //create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        
        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createUser = await User.create(user)

            //efetuar login
            require.session.userid = createUser.id

            require.flash('message', 'Cadastro realizado com sucesso!')

            require.session.save(() => {
                response.redirect('/')
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    static logout (require, response) {
        require.session.destroy()
        response.redirect('/login')
    }
}