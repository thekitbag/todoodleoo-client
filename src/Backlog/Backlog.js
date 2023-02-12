import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './backlog.css';
import {BacklogTask} from './../Task/Task.js';
import plusIcon from './../img/plus_icon.png';


const BacklogExplainer = (props) => {
	return 	<div className='col-12 new-user-copy'>
				<p>Hit '+' to add a new task</p>
			</div>
}

class Backlog extends React.Component {
	  render() {
		return  <div className='backlog-container col-12'>
				  <div className='component-container'>
				  	<div className='component-title'>
				  		<span>Backlog</span>
				  	</div>
					<div className='plus-icon-container'>
						<img
							alt="plus-icon"
							className='plus-icon'
							onClick={() => this.props.showAddTaskModal()}
							src={plusIcon}
						></img>
					</div>
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
										{(provided, snapshot) => (

											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
				      					        {...provided.dragHandleProps}
						    			    >
								  				<BacklogTask
													isDragging={snapshot.isDragging}
													projectId={this.props.projectId}
													themes={this.props.themes}
													epics={this.props.epics}
													allTimeboxes={this.props.allTimeboxes}
													deleteTask={this.props.deleteTask}
													editTask={this.props.editTask}
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
