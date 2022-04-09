import React from 'react';
import './register.css';
import { postRequest }from './../API/api.js'


class Register extends React.Component {

	state = { username: '', password: ''};

	signUp = (event) => {
		event.preventDefault()
		const data = {
			username: this.state.username,
			password: this.state.password,
		}
		postRequest('/register', data)
		.then((response) => {
		  console.log(response.data)
		}, (error) => {
		  console.log(error);
		});
    	this.setState({username: '', password: ''})
  	};

	render() {
		return  <div>
					<div className='row register-page'>
						<div className='col-8 mx-auto'>
							<h2 className='container'>Sign Up</h2>
							<form onSubmit={this.signUp}>
								<div className='form-group'>
									<input
									className='form-control form-control-lg m-2'
						          	type="text"
						          	value={this.state.username}
						          	onChange={event => this.setState({ username: event.target.value })}
						          	placeholder="Username"
						          	required
						        	/>
						        	<input
									className='form-control form-control-lg m-2'
						          	type="password"
						          	value={this.state.password}
						          	onChange={event => this.setState({ password: event.target.value })}
						          	placeholder="Password"
						          	required
						        	/>
						       </div>
						         <div className='col text-center'>
											<button className='btn btn-primary mx-auto mb-4'>Sign Up</button>
								</div>
							</form>
						</div>
					</div>
				</div>

	}
}

export default Register
