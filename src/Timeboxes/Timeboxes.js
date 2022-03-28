import React from 'react'
import { AddTimebox } from './../Forms/AddItem.js'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import {TimeboxTask} from './../Task/Task.js';
import './timeboxes.css';

const TimeboxesExplainer = (props) => {
	return 	<div className='col-12 new-user-copy'>
				<p>Timeboxes Let you organise tasks into groups like to do today or to do before holiday</p>
			</div>
}

class Timebox extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        tasks: this.props.tasks
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
      			await axios.post('/update_task_status', {
				task_id: taskId,
				target_status: 'In Progress' 
			})
      		this.updateTaskState(taskId, 'In Progress')

    } catch (err) {
      console.log('Task Update Failed');
    }
  };

  	completeTask = async (taskId) => {
  		try {
  				await axios.post('/update_task_status', {
  				task_id: taskId,
  				target_status: 'Done'
  			})
  			this.updateTaskState(taskId, 'Done')
  		} catch (err) {
  			console.log('Task Update Failed')
  		}
  	}

  	reopenTask = async (taskId) => {
  		try {
  				await axios.post('update_task_status', {
  				task_id: taskId,
  				target_status: 'To Do'
  			})
  			this.updateTaskState(taskId, 'To Do')
  		} catch (err) {
  			console.log('Task Update Failed')
  		}

  	}
  	

	render() {
		return  <Droppable droppableId={'Timebox:' + this.props.title}>
					{(provided) => (
						<div className='timebox card' ref={provided.innerRef}>
							<div className='card-body'>
								<h2 className='card-title text-center'>{this.props.title}</h2>
								<div className='timebox-status'>Status:{this.props.status}</div>
								<div className='timebox-goals mx-auto'>
									{this.props.goals.map( goal =>
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
		return  <div className='timeboxes-container col-6'>
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