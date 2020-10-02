const routes = require('./backend-routes.json')
const apiUrl = 'http://localhost'

// eslint-disable-next-line
module.exports = function (...args) {
  const name = args.shift()

  if (routes[name] === undefined) {
    console.error('Route not found ', name)
  }
  else {
    return apiUrl + '/' + routes[name]
      .split('/')
      .map((str) => str[0] === '{' ? args.shift() : str).join('/')
  }
}
