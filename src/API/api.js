import axios from 'axios';
import React from 'react';

let prefix = '/api'

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
    postRequest('/test', 'pingggggg')
  }
  render() {
    return <div className='btn btn-warning' onClick={() => this.ping()}>PING</div>
  }
}

class TestGet extends React.Component {
  ping = () => {
    getRequest('/test')
  }
  render() {
    return <div className='btn btn-success' onClick={() => this.ping()}>GET</div>
  }
}




export { getRequest, postRequest, prefix, TestPost, TestGet }
