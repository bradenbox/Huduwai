'use strict'

// list out explicitly to control order
module.exports = (app) => {
  app.flows = {
    help: require('./help')(app),
    whoisin: require('./whoisin')(app),
    chatter: require('./chatter')(app),
    askquestion: require('./askquestion')(app),
    makesuggestion: require('./makesuggestion')(app),
    unsuggest: require('./unsuggest')(app)
  }
}
