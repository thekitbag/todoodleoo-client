import axios from 'axios';
import React from 'react';

//const prefix = 'https://todoodleoo-server.herokuapp.com'
let prefix = ''
if (process.env.NODE_ENV === 'production') {
  prefix = 'https://todoodleoo-server.herokuapp.com'
} else {
  prefix = 'http://localhost:5000'
}


const getRequest = async (endpoint, params) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  const instance = axios.create({
    withCredentials: true,
    headers: headers
  })

  try {
    if (params) {
      const req = await instance.get(prefix + endpoint + '?' + params)
      return req
    } else {
      const req = await instance.get(prefix + endpoint)
      return req
    }

  } catch (err) {
    console.log(err)
  }
}

const postRequest = async (endpoint, data) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  const instance = axios.create({
    withCredentials: true,
    headers: headers
  })
  try {
      const req = await instance.post(prefix + endpoint, data)
      return req
  } catch (err) {
    console.log(err)
  }
}

class TestPost extends React.Component {
  ping = () => {
    postRequest('/auth/test', 'pingggggg')
  }
  render() {
    return <div className='btn btn-warning' onClick={() => this.ping()}>PING</div>
  }
}

class TestGet extends React.Component {
  ping = () => {
    getRequest('/auth/test')
  }
  render() {
    return <div className='btn btn-success' onClick={() => this.ping()}>GET</div>
  }
}




export { getRequest, postRequest, prefix, TestPost, TestGet }
