import React from 'react';
import './sidebar.css';
import hamburger from './../img/hamburger.png';



class Sidebar extends React.Component {
	constructor(){
        super();
        this.state = {
           expanded: false
        }
    }
	toggle = () => {
		this.setState({expanded: !this.state.expanded})
	}
	render() {
		let sidebar_class = this.state.expanded ? "sidebar expanded" : "sidebar retracted";
		return  <div className={sidebar_class}  id='sidebar'>
					<img onClick={this.toggle} src={hamburger} alt="hamburger.png" className="hamburger"/>
				</div>
	}
}

export default Sidebar;
