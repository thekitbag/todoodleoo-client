import React from 'react';
import { getRequest, postRequest, prefix }from './../API/api.js'

import './header.css';


class Header extends React.Component {
	constructor(props) {
    super(props);
    this.state = {isLoggedIn: false, username: false};
    }

    logout = async () => {
    	await postRequest('/auth/logout')
    	.then( (response) => {
    		window.location.href = '/login'
    	}, (err) => {
    		console.log(err)
    	});
    }

    getUserData = async () => {
			try {
				await getRequest('/auth/me')
	      .then((response) => {
					if (response.data.user_id !== -1) {  //user is not logged out
						this.setState({isLoggedIn: true});
			      this.setState({dataReceived: true});
			      this.setState({username: response.data.username});
						console.log('logged in user =', response.data.username)
					} else {
						console.log('logged out user')
					}

				})
			} catch (err) {
				console.log(err)
			}
    };

    componentDidMount() {
      this.getUserData();
    }

	render() {
		const isLoggedIn = this.state.isLoggedIn;
	  let buttons;

    if (isLoggedIn) {
      buttons = <div>
      						<div className='username'>{this.state.username}</div>
      						<div className='btn btn-light' onClick={this.logout}>Logout</div>
      					</div>;
    } else {
      buttons = <div className='auth-buttons'>
		      				<div className='btn btn-primary' onClick={() => window.location.href = '/login'}>Login</div>
					 				<div className='btn btn-primary' onClick={() => window.location.href = '/register'}>Sign Up</div>
		      			</div>
    }

		return <div className='header text-center'>
							<div className='row'>
								<div className='col-3'>
									<div className='logo' onClick={() => window.location.href = '/'}>Todoodleoo {process.env.NODE_ENV} {prefix}</div>
								</div>
								<div className='col-6'>
								</div>
								<div className='col-3'>
									{buttons}
								</div>
							</div>
						</div>
			}
}

export default Header
