import React from 'react';
import axios from 'axios';
import './header.css';


class Header extends React.Component {
	constructor(props) {
    super(props);
    this.state = {isLoggedIn: false, username: false};
    }

    logout = async () => {
    	await axios.post('/auth/logout')
    	.then( (response) => {
    		window.location.href = '/'
    	}, (err) => {
    		console.log(err)
    	});
    }

    getUserData = async () => {
      await axios.get('/auth/me')
      .then((response) => {
	      this.setState({isLoggedIn: true});
	      this.setState({dataReceived: true});
	      this.setState({username: response.data.username});
	    }, (error) => {
	      console.log('Not Logged In');
	    });
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
									<div className='logo' onClick={() => window.location.href = '/'}>Todoodleoo</div>
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