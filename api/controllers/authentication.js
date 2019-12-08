const { UserService } = require('../services/user-service')
const { InputValidator } = require('../validators/input-validator')

class AuthenticationController {
  constructor (db) {
    this.userService = new UserService(db)
    this.registerUser = this.registerUser.bind(this)
    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  // Validate Email
  // Validate Password
  // Save User

  async registerUser (req, res, next) {
    const body = req.body
    if (!req.body.email || !req.body.password) {
      return res.status(400).send('email id is not specified')
    }
    try {
      const registerResp = await this.userService.registerUser(body.name, body.email, body.password)
      if (registerResp.data) {
      // return next(null, 'user registered successfully')
        res.status(201).send(registerResp)
      }
    } catch (err) {
      if (err.message === 'username already exist') {
        res.status(400).send(err.message)
      } else {
        res.status(400).send('user is not registered successfully')
      }
    }
  }

  async logIn (req, res, next) {
    const body = req.body
    let registerResp
    try {
      registerResp = await this.userService.logIn(body.email, body.password)
      if (registerResp.data) {
        // return next(null, 'user registered successfully')
        res.status(200).send({ token: registerResp.token, data: 'user logged in successful' })
      }
    } catch (err) {
      if (err.message === 'password not matched') {
        res.status(200).send(err.message)
      } else {
        res.status(200).send(err.message)
      }
    }
  }

  async logOut (req, res, next) {
    // return next(null, 'API to be written')
    const token = req.params.token
    let registerResp
    try {
      registerResp = await this.userService.logOut(token)
      if (registerResp.data) {
        // return next(null, 'user registered successfully')
        res.status(200).send('user logged out successfully')
      }
    } catch (err) {
      if (err.message === 'provided token not exist') {
        res.status(200).send(err.message)
      } else {
        res.status(200).send(err.message)
      }
    }
  }
}

module.exports.AuthenticationController = AuthenticationController
