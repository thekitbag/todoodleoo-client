import React from 'react';
import { getRequest, postRequest }from './../API/api.js'

import './header.css';


class Header extends React.Component {
	constructor(props) {
    super(props);
    this.state = {isLoggedIn: false, username: false, dataReceived:false};
    }

    logout = async () => {
    	await postRequest('/logout')
    	.then( (response) => {
    		window.location.href = '/login'
    	}, (err) => {
    		console.log(err)
    	});
    }

    getUserData = async () => {
			try {
				await getRequest('/me')
	      		.then((response) => {
					if (response.data.user_id !== -1) {  //user is not logged out
						this.setState({isLoggedIn: true});
			      this.setState({dataReceived: true});
			      this.setState({username: response.data.username});
						console.log('logged in user =', response.data.username)
					} else {
						console.log('logged out user')
					}
					this.setState({dataReceived: true})

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
		buttons = <div className='row mt-3'>
						<div className='col-3'>
						</div>
						<div className='col-8'>
							<div className='btn btn-dark' onClick={this.logout}>Logout</div>
						</div>
					</div>
		} else {
		buttons = <div className='auth-buttons mt-2'>
								<div className='btn btn-secondary left' onClick={() => window.location.href = '/login'}>Login</div>
										<div className='btn btn-secondary' onClick={() => window.location.href = '/register'}>Sign Up</div>
							</div>
		}

		return <div className='header text-center'>
							<div className='row'>
								<div className='col-6'>
									<div className='logo' onClick={() => window.location.href = '/'}>Todoodleoo</div>
								</div>
								{this.state.dataReceived === false ?
									<div></div>: 	
									<div className='col-6'>
										{buttons}
									</div>
								} 
							</div>
						</div>
			}
}

export default Header
