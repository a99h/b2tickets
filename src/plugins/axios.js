import axios from 'axios'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.common['accept'] = 'application/json'
//axios.defaults.withCredentials = true
//
// export default axios

export default axios.create({
  withCredentials: true,
  headers: {
    common: {
      Accept: 'application/json'
    }
  }
})
