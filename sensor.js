'use strict'
const Nomad = require('nomad-stream')
const moment = require('moment')
const nomad = new Nomad()
const fetch = require('node-fetch')

let instance = null
const frequency = 30 * 1000

// parse into url object
let base = 'https://newsapi.org/v1/articles?source=reddit-r-all&sortBy=top&apiKey=827666c95cdc4d1486c8c225448decae'

// returns promise
function getMessage() {
  const url = base
  return fetch(url).then(res => {
    return res.json();
  }).then(json => {
    console.log(json)
    console.log('\n')
    return Promise.resolve(JSON.stringify(json))
  }).catch(err => {
    console.log(err)
    return Promise.reject(err)
  })
}

nomad.prepareToPublish().then((n) => {
  instance = n
  return instance.publishRoot('hello')
}).then(() => {
  setInterval(() => {
    getMessage().then(m => {
      return instance.publish(m)
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    })
  }, frequency)
})
.catch(console.log)
