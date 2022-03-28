import React from "react";
import axios from 'axios';
import './login.css';

class Login extends React.Component {
  state = { username: '', password: ''};

  loginFailed = () => {
   const el = document.getElementById('error')
   el.innerHTML = 'Login failed, incorrect username or password'
  }

  handleSubmit = (event) => {
    axios.post('/auth/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then((response) => {
      window.location.href = '/'
    }, (error) => {
      if (error.response.status === 401) {
        this.loginFailed()
      }
    });
      event.preventDefault()
      this.setState({username : '', password: ''})   
  };
  render() {
    return <div className='login-page'>
          <div className='row'>
            <div className='col-8 mx-auto'>
              <h2 className='container'>Log In</h2>
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