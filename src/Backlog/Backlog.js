import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './backlog.css';
import { AddTask } from './../Forms/AddItem.js'
import {BacklogTask} from './../Task/Task.js';

const BacklogExplainer = (props) => {
	return 	<div className='col-12 mt-5 new-user-copy'>
				<p>The backlog is where new tasks go before they have been added to a timebox</p>
			</div>
}

class Backlog extends React.Component {
	render() {
		return  <div className='backlog-container col-4'>
				  <div className='component-container'>
				  	<div className='component-title'>
				  		<span>Backlog</span>
				  	</div>
				  	<AddTask 
				  		projectId={this.props.projectId}
				  		updateTasks={this.props.addTask}
				  	/>
				  	<Droppable droppableId={'Backlog'}>
						{(provided) => (
							<div 
								className='row m-2'
								ref={provided.innerRef} 
							>
							{this.props.tasks.length === 0 &&
								<BacklogExplainer />
							}
						  	{this.props.tasks.map(
						  		(task, index) => 
						  		task.timebox === 'Backlog' &&
							  		<Draggable key={task.id} draggableId={String(task.id)} index={index}>
										{provided => (

											<div  
												ref={provided.innerRef}
												{...provided.draggableProps}
				      					        {...provided.dragHandleProps}		
						    			    >
								  				<BacklogTask 
													themes={this.props.themes}
													epics={this.props.epics}
													allTimeboxes={this.props.allTimeboxes}
													deleteTask={this.props.deleteTask}
													{...task}
												/>
											</div>
										)}
									</Draggable>

						  	)}


						  	{provided.placeholder}
						  	</div>
						  	)}
					</Droppable>
				  </div>
				</div>
	}
}

export default Backlog