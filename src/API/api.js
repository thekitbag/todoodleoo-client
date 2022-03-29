import axios from 'axios';

const prefix = 'http://localhost:5000'

const getRequest = async (endpoint, params) => {
  try {
      const req = await axios.get(prefix + endpoint + '?' + params)
      return req
  } catch (err) {
    console.log(err)
  }
}

const postRequest = async (endpoint, data) => {
  try {
      const req = await axios.post(prefix + endpoint, data)
      return req
  } catch (err) {
    console.log(err)
  }
}



export { getRequest, postRequest }
