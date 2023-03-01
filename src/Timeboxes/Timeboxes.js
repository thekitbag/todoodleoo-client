import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {TimeboxTask} from './../Task/Task.js';
import './timeboxes.css';
import { postRequest }from './../API/api.js'
import pencil from './../img/pencil.svg';
import deleteIcon from './../img/delete_icon.png';


class Timebox extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        tasks: this.props.tasks,
					title: this.props.title,
					goal: this.props.goal
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
		}
		catch (err) {
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
		}
  		catch (err) {
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
  		} 
		catch (err) {
  			console.log('Task Update Failed')
  		}
  	}

	editMode = () => {
		this.setState({editing: true})
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
										<div className='btn btn-primary btn-sm' onClick={() => this.props.editTimebox(this)}>save</div> :
										<span className='edit-pencil-container'>
											<img alt="edit-pencil" className='edit-pencil' onClick={() => this.editMode()} src={pencil}></img>
										</span>
									}
									<span className='delete-icon-container'>
										<img alt="delete-icon" className='delete-icon' onClick={() => this.props.deleteTimebox(this.props.id)} src={deleteIcon}></img>
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
										<h4 className='card-title text-center'>{this.state.title}</h4>
									}
									<div className='row'>
										<div className='timebox-status col-6'>Status:{this.props.status}</div>
										<div className='col-6'>
											<div className='btn btn-primary' style={{float:'right'}} onClick={() => this.props.closeTimebox(this)}>Close Timebox</div>
										</div>
									</div>
									<div className='timebox-goals mx-auto mt-2'>
										{this.state.editing === true ?
											<form>
												<div className='col-12 mx-auto mt-2 goals-group'>
													<input className='form-control' value={this.state.goal} type="text" onChange={event => this.setState({goal: event.target.value})}/>
												</div>
											</form> :			
												'goal' in this.props && 
												<div className='timebox-goal'>
													{this.state.goal}
												</div>
										}
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
		return  <div className='col-12 mb-2'>
				  	<div className='row mt-2 mb-2'>
					  	{this.props.timeboxes.map(timebox =>
					  		timebox.title !== 'Backlog' &&
					  		<Timebox
								key={timebox.id}
								projectId={this.props.projectId}
								deleteTimebox={this.props.deleteTimebox}
								editTimebox={this.props.editTimebox}
								closeTimebox={this.props.closeTimebox}
								tasks={this.props.tasks.filter(t => t.timebox === timebox.title)}
								{...timebox}
							 />
					  		)}
					</div>
				</div>
	}
}


export default Timeboxes
