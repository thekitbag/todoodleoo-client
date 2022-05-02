import React from 'react'
import { AddTimebox } from './../Forms/AddItem.js'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {TimeboxTask} from './../Task/Task.js';
import './timeboxes.css';
import { postRequest }from './../API/api.js'
import pencil from './../img/pencil.svg';
import deleteIcon from './../img/delete_icon.png';


const TimeboxesExplainer = (props) => {
	return 	<div className='col-12 new-user-copy'>
				<p>Timeboxes Let you organise tasks into groups like to do today or to do before holiday</p>
			</div>
}

class Timebox extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        tasks: this.props.tasks,
					title: this.props.title,
					goals: this.props.goals
	    };
	  }
	static getDerivedStateFromProps(nextProps, prevState){
			   if(nextProps.tasks !== prevState.tasks){
			     return { tasks: nextProps.tasks};
			  }
			  else return null;
			}

	updateTaskState = (taskId, targetStatus) => {
		const tasks = this.state.tasks
		const task = this.state.tasks.find(t => t.id === taskId)
		task.status = targetStatus
		const indx = this.state.tasks.indexOf(task)
  		tasks.splice(indx, 1, task)
  		console.log(tasks)
  		this.setState({tasks: [...tasks]})
	}

	startTask = async (taskId) => {

		try {
			const data = {
				task_id: taskId,
				target_status: 'In Progress'
			}
			postRequest('/update_task_status', data)
      this.updateTaskState(taskId, 'In Progress')
    } catch (err) {
      console.log('Task Update Failed');
    }
  };

  	completeTask = async (taskId) => {
  		try {
				const data = {
					task_id: taskId,
					target_status: 'Done'
				}
				postRequest('/update_task_status', data)
  			this.updateTaskState(taskId, 'Done')
  		} catch (err) {
  			console.log('Task Update Failed')
  		}
  	}

  	reopenTask = async (taskId) => {
  		try {
				const data = {
					task_id: taskId,
					target_status: 'To Do'
				}
				postRequest('/update_task_status', data)
  			this.updateTaskState(taskId, 'To Do')
  		} catch (err) {
  			console.log('Task Update Failed')
  		}
  	}

		deleteTimebox = async (timeboxId) => {
			try {
				const data = {
					project_id: this.props.projectId,
					timebox_id: timeboxId
				}
				postRequest('/delete_timebox', data)
				this.props.deleteTimebox(timeboxId)
			} catch (err) {
				console.log(err)
			}
		}

		editMode = () => {
			this.setState({editing: true})
		}

		save = (timeboxId) => {
			this.props.editTimebox(timeboxId, this.state)
			this.setState({editing: false})
			try {
				const data = {
					project_id: this.props.projectId,
					timebox_id: timeboxId,
					title: this.state.title,
					goals: this.state.goals
				}
				postRequest('/edit_timebox', data)
			} catch (err) {
				console.log(err)
			}
		}

		closeTimebox = () => {
			try {
				const data = {
					project_id: this.props.projectId,
					timebox_id: this.props.id,
					status: 'Closed'
				}
				postRequest('/update_timebox_status', data)
				this.props.updateTimeboxStatus(this.props.id, 'Closed')
			} catch (err) {
				console.log(err)
			}
		}


	render() {
			return  <Droppable
								droppableId={'Timebox:' + this.props.title}
								key={this.props.id}
							>
							{(provided) => (
								<div className='timebox card' ref={provided.innerRef}>
									<div className='card-body'>
										{this.state.editing === true ?
											<div className='btn btn-primary btn-sm' onClick={() => this.save(this.props.id)}>save</div> :
											<span className='edit-pencil-container'>
												<img alt="edit-pencil" className='edit-pencil' onClick={() => this.editMode()} src={pencil}></img>
											</span>
										}
										<span className='delete-icon-container'>
											<img alt="delete-icon" className='delete-icon' onClick={() => this.deleteTimebox(this.props.id)} src={deleteIcon}></img>
										</span>
										{this.state.editing === true ?
											<form>
												<textarea
													className='form-control form-control mt-1 mb-1'
													type="text"
													value={this.state.title}
													onChange={event => this.setState({ title: event.target.value })}
													required
												/>
											</form> :
											<h4 className='card-title text-center'>{this.props.title}</h4>
										}
										<div className='row'>
											<div className='timebox-status col-6'>Status:{this.props.status}</div>
											<div className='col-6'>
												<div className='btn btn-primary' style={{float:'right'}} onClick={this.closeTimebox}>Close Timebox</div>
											</div>
										</div>
										<div className='timebox-goals mx-auto mt-2'>
											{this.state.editing === true ?
												<form>
													<div className='col-12 mx-auto mt-2 goals-group'>
														<input className='form-control' value={this.state.goals[0]} type="text" onChange={event => this.setState({goals: [event.target.value, this.state.goals[1], this.state.goals[2]]})}/>
														<input className='form-control' value={this.state.goals[1]} type="text" onChange={event => this.setState({goals: [this.state.goals[0], event.target.value, this.state.goals[2]]})}/>
														<input className='form-control' value={this.state.goals[2]} type="text" onChange={event => this.setState({goals: [this.state.goals[0], this.state.goals[1], event.target.value]})}/>
													</div>
												</form> :

											this.props.goals.map( goal =>
												<div className='timebox-goal'>
													{goal}
												</div>
												)}

										</div>
										<div className='timebox-tasks'>
											{this.state.tasks.map( (task, index) =>
														<Draggable key={task.id} draggableId={String(task.id)} index={index}>
															{provided => (

																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
									      					        {...provided.dragHandleProps}
											    			    >
															<TimeboxTask
																{...task}
																startTask={this.startTask}
																completeTask={this.completeTask}
																reopenTask={this.reopenTask}
															/>
																</div>
															)}
														</Draggable>
													)}
										</div>
									</div>
									{provided.placeholder}
								</div>
							)}
						</Droppable>

			}
		}

class Timeboxes extends React.Component {
	render() {
		return  <div className='timeboxes-container col-5'>
				  <div className='component-container'>
				    <div className='component-title'>
				  		<span>Timeboxes</span>
				  	</div>
				  	<AddTimebox
				  	  projectId={this.props.projectId}
				  	  updateTimeboxes={this.props.addTimebox}
				  	/>
				  	<div className='row m-2'>
				  		{this.props.tasks.length === 0 &&
				  			<TimeboxesExplainer />
				  		}
					  	{this.props.timeboxes.map(timebox =>
					  		timebox.title !== 'Backlog' &&
					  		<Timebox
								key={timebox.id}
								projectId={this.props.projectId}
								deleteTimebox={this.props.deleteTimebox}
								editTimebox={this.props.editTimebox}
								updateTimeboxStatus={this.props.updateTimeboxStatus}
								tasks={this.props.tasks.filter(t => t.timebox === timebox.title)}
								{...timebox}
							 />
					  		)}

					</div>
				  </div>
				</div>
	}
}


export default Timeboxes
