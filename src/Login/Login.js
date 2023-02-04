import React from "react";
import { postRequest }from './../API/api.js'
import './login.css';

class Login extends React.Component {
  state = { username: '', password: ''};

  loginFailed = () => {
   const el = document.getElementById('error')
   el.innerHTML = 'Login failed, incorrect username or password'
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    try {
      await postRequest('/login', data)
      .then((resp) => {
        if ( resp.data === "Incorrect username/password combo") {
          this.loginFailed()
        }
        else {
          window.location = '/'
        }
      }, (error) => {
        console.log(error)
      })
    } catch (err) {
      console.log('error:', err)
    }
      this.setState({username : '', password: ''})
  };
  render() {
    return <div className='login-page'>
          <div className='row'>
            <div className='col-8 mx-auto'>
              <h2 className='container text-center'>Log In</h2>
              <div id='error'></div>
              <form onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  <input type="text"
                    className='form-control form-control-lg m-2'
                    placeholder="Username"
                    onChange={event => this.setState({ username: event.target.value })}
                    value={this.state.username}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    className='form-control form-control-lg m-2'
                    placeholder="Password"
                    onChange={event => this.setState({ password: event.target.value })}
                    value={this.state.password}
                  />
                </div>
                     <div className='col text-center'>
                      <button className='btn btn-primary mx-auto mb-4'>Log in</button>
                </div>
              </form>
            </div>
          </div>
        </div>

  }
}

export default  Login
