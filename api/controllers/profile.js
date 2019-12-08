const { UserService } = require('../services/user-service')

class ProfileController {
  constructor (db) {
    this.userService = new UserService(db)
    this.getUserProfile = this.getUserProfile.bind(this)
  }

  async getUserProfile (req, res, next) {
    // return next('API to be written')
    // res.status(200).json({message: 'asdf'})
    // return next(null, 'API to be written')
    const token = req.token
    if (!token) {
      return res.status(401).send('token is not specified')
    }
    let registerResp
    try {
      registerResp = await this.userService.getUserProfileByToken(token)
      if (registerResp) {
        // return next(null, 'user registered successfully')
        res.status(200).send(registerResp)
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

module.exports.ProfileController = ProfileController
