import React from 'react';
import axios from 'axios';
import pencil from './../img/pencil.svg';
import deleteIcon from './../img/delete_icon.png';
import './task.css';




class Task extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	//projectId: this.props.projectId,
	        id: this.props.id,
			title: this.props.title, 
			status:this.props.status, 
			priority: this.props.priority,
			theme: this.props.theme,
			epic: this.props.epic,
			timeboxes: this.props.timeboxes,
			themeColor: this.props.theme_color,
			editing:false
	    };
	  }

	static getDerivedStateFromProps(nextProps, prevState){
			   if(nextProps.themeColor !== prevState.themeColor){
			     return { themeColor: nextProps.theme_color};
			  }
			  else return null;
			}

	edit = () => {
		this.setState({editing: true})
	}

	save = (event) => {
		this.setState({editing: false})
		axios.post('/edit_task', {
		  id: this.state.id,
		  title: this.state.title,
		  status: this.state.status,
		  theme: this.state.theme,
		  timeboxes: this.state.timeboxes,
		  priority: this.state.priority
		});
	}

	editTaskName = (event) => {
		event.preventDefault()
		this.setState({editing: false})
		axios.post('/edit_task', {
		  id: this.state.id,
		  title: this.state.title,
		  status: this.state.status,
		  theme: this.state.theme,
		  priority: this.state.priority
		});
	}

	getThemeColor = (themeName) => {
		const theme = this.props.themes.find( o => o.title === themeName)
		return theme.color
	}

	render() {
		return  <div className='card m-2'>
						{this.state.editing === false ? (

							<div className='card-body'>
								<div className='row'>
									<div className='col-6'>
									  {this.props.status}
									</div>
									<div className='col-6'>
									  {this.props.ctas}
									</div>
									<div className='col-2'>
										<div className='theme-blob' style={{backgroundColor: this.state.themeColor}}></div>
									</div>
									<div className='card-title col-8'>
										<h2>{this.state.title}</h2>
									</div>
									{this.props.editable &&
									<div className='col-2'>
										<img alt="edit-pencil" className='edit-pencil' onClick={this.edit} src={pencil}></img>
									</div>
									}
									{this.props.deleteable === true &&
										<div className='col-12'>
											<img alt="delete-icon" className='delete-icon' onClick={() => this.props.deleteTask(this.state.id)} src={deleteIcon}></img>
										</div>
									}
								</div>
								<div className='row'>
									<div className='col-10'>
										
									</div>
								</div>
								<div className='row'>
									
								</div>
							</div> ) 

							:(

							<div className='card-body'>
								<div className='row'>
									<div className='col-6'>							
										<div class='btn btn-primary' onClick={this.save}>Save</div>
									</div>
								</div>
								<div className='row'>
									<div className='col-12'>
										<form onSubmit={this.editTaskName}>
									 	<div className='form-group'>
											<textarea
												className='form-control form-control mt-1 mb-1'
									            type="text" 
									            value={this.state.title}
									            onChange={event => this.setState({ title: event.target.value })}
									            placeholder= {this.state.title}
									            required 
									        />
									        <select className="form-select mt-1 mb-1" onChange={event => this.setState({ theme: event.target.value, themeColor: this.getThemeColor(event.target.value) })}>
											  <option defaultValue >{this.state.theme}</option>
											  {this.props.themes.map(theme => {
												return theme.title !== this.state.theme ?
											  	<option key={theme.id} value={theme.title}>{theme.title}</option>
											  	: <></>
											  }
											   )};
											</select>
											
											
										</div>
									 </form>
									</div>
								</div>
							</div> )
							}
						</div>
	}
}

class TimeboxTask extends React.Component {

	Status = (props) => {
		let statusPill = <div className='status-pill'></div>
		if (props.status === 'To Do') {
			statusPill = <div className='status-pill to-do'>To Do</div>
		} else if (props.status === 'In Progress') {
			statusPill = <div className='status-pill in-progress'>In Prog</div>
		} else if (props.status === 'Done') {
			statusPill = <div className='status-pill done'>Done</div>
		}else {
			statusPill = <div></div>
		}

		return <div className='status-bar'>
				{statusPill}
			   </div>
	}

	CTAs = (props) => {
		const startTask  = () => {
			props.startTask(this.props.id)
		}

		const completeTask = () => {
			props.completeTask(this.props.id)
		}

		const reopenTask = () => {
			props.reopenTask(this.props.id)
		}

		let btn = <div className='btn btn-primary'></div>

		if (props.status === 'To Do') {
			btn = <div 
					className='btn btn-primary'
					onClick={() => startTask()}
				  >
				    Start
				  </div>
		} else if (props.status === 'In Progress') {
			btn = <div
					className='btn btn-primary'
					onClick={() => completeTask()}
				  >
				  	Complete
				  </div>
		} else if (props.status === 'Done') {
			btn = <div
					className='btn btn-primary'
					onClick={() => reopenTask()}
				  >
				  	Reopen
				  </div>
		}
		return  <div className='ctas-container'>
					{btn}
				</div>
	}

	render() {
		return  <Task 
				  {...this.props}
				  status={<this.Status status={this.props.status}/>}
				  ctas={<this.CTAs 
				  			status={this.props.status}
				  			startTask={this.props.startTask}
				  			completeTask={this.props.completeTask}
				  			reopenTask={this.props.reopenTask}
				  		/>}
				/>
	}
}

class BacklogTask extends React.Component {
	render() {
		console.log(this.props)
		return <Task 
				{...this.props}
				editable={true}
				deleteable={true}
				status={false}
				deleteTask={this.props.deleteTask}
			   />
	}
}

export {TimeboxTask, BacklogTask};