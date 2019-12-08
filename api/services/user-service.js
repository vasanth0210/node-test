const uuid = require('uuid')
const crypto = require('crypto')
const q = require('q')

function hash (str) {
  const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET || 'test-secret')
  hmac.update(str)
  return hmac.digest('hex')
}

function createToken () {
  return 'token.' + uuid.v4().split('-').join('')
}

class UserService {
  constructor (db) {
    this.db = db
    this.getUserProfileByToken = this.getUserProfileByToken.bind(this)
    this.registerUser = this.registerUser.bind(this)
    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)
    this.savetoken = this.savetoken.bind(this)
    this.deletetoken = this.deletetoken.bind(this)
    this.insertdoc = this.insertdoc.bind(this)
  }

  /**
   * Registers a user and returns it's token
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to user's token or rejects with Error that has statusCodes
   */
  registerUser (name, email, password) {
    /*     var collection = this.db.collection('users')
    console.log('$$$$$$$$$$$$$$$$$', collection)
    return new Promise((resolve, reject) => {
      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'email': email }
      let data = { name: name, email: email, password: hash(password) }
      collection.updateOne(query, data, { upsert: true }, (err, resp) => {
        if (err) {
          reject(err)
        } else {
          let token = createToken()
          resolve({ data: 'user registered successfully', token: token })
        }
      })
    }) */
    var collection = this.db.collection('users')
    // console.log('$$$$$$$$$$$$$$$$$', collection)
    return new Promise((resolve, reject) => {
      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'email': email }
      //   let data = { name: name, email: email, password: hash(password) }
      collection.findOne(query, (err, resp) => {
        if (err) {
          reject(err)
        } else if (resp) {
          reject(new Error('username already exist'))
        } else {
          let token = createToken()
          this.insertdoc(name, email, password)
          resolve({ data: 'user registered successfully', token: token })
        }
      })
    })
  }

  /**
   * Gets a user profile by token
   * @param {String} token
   * @return {Promise} that resolves to object with email and name of user or rejects with error
   */
  getUserProfileByToken (token) {
    var collection = this.db.collection('userstoken')
    return new Promise((resolve, reject) => {
      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'token': token }
      //   let data = { name: name, email: email, password: hash(password) }
      collection.findOne(query, (err, resp) => {
        if (err) {
          reject(err)
        } else if (!resp) {
          reject(new Error('provided token not exist'))
        } else {
          // this.deletetoken(token)
          resolve(resp)
        }
      })
    })
  }

  /**
   * Log in a user to get his token
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to token or rejects to error
   */
  logIn (email, password) {
    /* const deferred = q.defer()
    setTimeout(deferred.error('YET TO CODE API'), 100)
    return deferred.promise */

    var collection = this.db.collection('users')
    // console.log('$$$$$$$$$$$$$$$$$', collection)
    return new Promise((resolve, reject) => {
      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'email': email }
      //   let data = { name: name, email: email, password: hash(password) }
      collection.findOne(query, (err, resp) => {
        if (err) {
          reject(err)
        } else if (!resp) {
          reject(new Error('Please check your username you have entered'))
        } else {
          let passwordfromdb = resp.password
          let passwordfromuser = hash(password)
          if (passwordfromdb === passwordfromuser) {
            let token = createToken()
            this.savetoken(email, token)
            resolve({ data: 'user logged in successful', token: token })
          } else {
            reject(new Error('password not matched'))
          }
        }
      })
    })
  }

  logOut (token) {
    /*    const deferred = q.defer()
    setTimeout(deferred.error('YET TO CODE API'), 100)
    return deferred.promise */
    var collection = this.db.collection('userstoken')
    // console.log('$$$$$$$$$$$$$$$$$', collection)
    return new Promise((resolve, reject) => {
      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'token': token }
      //   let data = { name: name, email: email, password: hash(password) }
      collection.findOne(query, (err, resp) => {
        if (err) {
          reject(err)
        } else if (!resp) {
          reject(new Error('provided token not exist'))
        } else {
          this.deletetoken(token)
          resolve({ data: 'user is logged out' })
        }
      })
    })
  }

  savetoken (email, token) {
    return new Promise((resolve, reject) => {
      let collection = this.db.collection('userstoken')
      console.log('$$$$$$$$$$$$$$$$$', collection)

      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'email': email }
      let data = { email: email, token: token }
      collection.updateOne(query, data, { upsert: true }, (err, resp) => {
        if (err) {
          reject(err)
        } else {
          resolve(resp)
        }
      })
    })
  }

  insertdoc (name, email, password) {
    var collection = this.db.collection('users')
    console.log('$$$$$$$$$$$$$$$$$', collection)
    return new Promise((resolve, reject) => {
      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'email': email }
      let data = { name: name, email: email, password: hash(password) }
      collection.updateOne(query, data, { upsert: true }, (err, resp) => {
        if (err) {
          reject(err)
        } else {
          // let token = createToken()
          resolve(resp)
        }
      })
    })
  }

  deletetoken (token) {
    return new Promise((resolve, reject) => {
      let collection = this.db.collection('userstoken')
      console.log('$$$$$$$$$$$$$$$$$', collection)

      // collection.updateOne({ name: name, email: email, password: hash(password) }, {}, (err, resp) => {
      let query = { 'token': token }
      //  let data = { email: email, token: token }
      collection.deleteOne(query, (err, resp) => {
        if (err) {
          reject(err)
        } else {
          resolve(resp)
        }
      })
    })
  }
}

module.exports.UserService = UserService
