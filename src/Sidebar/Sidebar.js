import React from 'react';
import './sidebar.css';
import hamburger from './../img/hamburger.png';



class Sidebar extends React.Component {
	render() {
		return  <div className='sidebar'>
					<img src={hamburger} alt="hamburger.png" className="hamburger"/>
				</div>
	}
}

export default Sidebar;