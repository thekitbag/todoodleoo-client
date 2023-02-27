import React from 'react';
import 'bootstrap';
import './board.css';
import { postRequest }from './../API/api.js'
import { DragDropContext } from 'react-beautiful-dnd';
import Themes from './../Themes/Themes.js'
import Backlog from './../Backlog/Backlog.js'
import Timeboxes from './../Timeboxes/Timeboxes.js'
import TimeboxesExplainer from '../Explainer/TimeboxesExplainer';
import Modal from './../Forms/Modal';
import { AddTimebox } from './../Forms/AddItem.js';
import shareIcon from './../img/share_icon.png';
import {handleThemeDrop,
	handleTimeboxDrop,
	handleBacklogDrop,
	handleSameListReorder,
	handleMoveBackToBacklogDrop
	} from './dragAndDrop'
import { getTasks, addTask, deleteTask, editTask, addTimebox } from './crud';
import { handleEditTaskResponse } from './responseHandlers';

class Board extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        dataReceived: false,
			showModalStatus: false,
			showThemesStatus: false
	    };
	}

	async componentDidMount() {
		//When user goes to /board gets the projectId or redirects to home if it's 0 or missing
		const sp = new URLSearchParams(this.props.location.query);
		const projectId = Number(sp.get("projectId"))
		if (projectId === null || projectId === 0) {
			this.props.history.push('/')
		} else {
			this.setState({projectId: projectId});
			await getTasks(projectId, this);
			this.setState({dataReceived: true});
		}
 	}
	  
	addTask = async (title) => {
		addTask(title, this)
	}
	
	deleteTask = async (taskId) => {
		deleteTask(taskId, this)
	}

	editTask = async (taskObj) => {
		let resp = await editTask(taskObj)
		handleEditTaskResponse(resp, this)
	}

	newAddTimebox = async (title, goal) => {
		addTimebox(title, goal, this)
	}

	deleteTimebox = (timeboxId) => {
		const timeboxes = this.state.timeboxes.filter(tb => tb.id !== timeboxId)
		this.setState({timeboxes: timeboxes})
	}

	editTimebox = (timeboxId, timeboxData) => {
		const timeboxes = this.state.timeboxes
		const timebox = timeboxes.find(tb => tb.id === timeboxId)
		const idx = timeboxes.indexOf(timebox)
		timebox.title = timeboxData.title
		timebox.goals = timeboxData.goals
		timeboxes.splice(idx, 1, timebox)
		this.setState({timeboxes: timeboxes})
	}

	updateTimeboxStatus = (timeboxId, status) => {
		const timeboxes = this.state.timeboxes.filter(tb => tb.id !== timeboxId)
		this.setState({timeboxes: timeboxes})
		getTasks(this.state.projectId, this)
	}

  	addTheme = (themeData) => {
		this.hideModal()
  		this.setState(prevState => ({
    		themes: [...this.state.themes, themeData],
    		}));
  	}

  	deleteTheme = (themeId) => {
		const data = {
  			theme_id: themeId,
  			project_id: this.state.projectId
  		}
		postRequest('/delete_theme', data)
  		const themes = this.state.themes.filter(t => t.id !== themeId)
  		this.setState(prevState => ({
		    	themes: themes,
		    }));
  	}

  	filterByTheme = (theme) => {
	  		const filteredTasks = this.state.tasks.filter(task => task.theme === theme);
	  		this.setState(prevState => ({
		    	visibleTasks: filteredTasks,
		    	filtering: true
		    }));
  	}

  	clearFilters = () => {
  		this.setState({visibleTasks: this.state.tasks, filtering: false})
  	}

	showModal = (itemToAdd) => {
		this.setState({showModalStatus: itemToAdd})
	}

	hideModal = () => {
		this.setState({showModalStatus: false})
	}

	showThemes = () => {
		this.setState({showThemesStatus: true})
	}

	hideThemes = () => {
		this.setState({showThemesStatus: false})
	}

	onDragStart = () => {
		this.setState({dragging: true})
	}

	onDragEnd = async (result) => {

		const {destination, source, draggableId} = result;
	
		if (!destination) {
			//dragging somewhere non-droppable
			return;
		}
		if (
			//dragging and dropping into same place
			destination.droppableId === source.droppableId &&
			destination.index === source.index
			) {
			return;
		}
	
		const taskId = Number(draggableId)
		const obj = this.state.tasks.find(o => o.id === taskId);
	
		if (destination.droppableId.slice(0,5) === 'Theme') {
			//landed on a theme, keep timebox the same and update the theme
			handleThemeDrop(destination, taskId, obj, this)
		}
	
		if (destination.droppableId.slice(0,7) === 'Timebox') {
			//landed in a timebox - get timebox, remove from tasks, update timebox and put back in new position
			handleTimeboxDrop(destination, result, taskId, obj, this)
		  }
	
		if (destination.droppableId === 'Backlog') {
			//landed in backlog - remove from source list, add to backlog and update state with all the updated lists
			handleBacklogDrop(destination, result, taskId, this)
	
		const destinationList = this.state.tasks.filter(t => t.timebox === destination.droppableId);
		const otherTasks = this.state.tasks.filter(t => t.timebox !== destination.droppableId);
	
		if (source.droppableId === destination.droppableId) {
			//same list so simply take it out and put it bakc in new position
			handleSameListReorder(source, result, obj, this)
		} 
		  
		else {
			//moving from timebox to backlog so remove from source, add to backlog at index and all tasks back to state
			handleMoveBackToBacklogDrop(obj, this, otherTasks, destinationList)
		}

	  } else {
		  console.log('Unexpected drop destination')
	  }
	
	}

	render() {
		return   this.state.dataReceived === true ? (
						<DragDropContext
							onDragEnd = {this.onDragEnd}
							onDragUpdate={this.onDragUpdate}
							onDragStart={this.onDragStart}
						>
							<div className='board row' style={{margin: 0}}>
								<h2 className='text-center mb-2'>{this.state.projectTitle}</h2>
								<div className='btn btn-primary w-25 mx-auto mb-2' onClick = {() => this.showModal('share')}>
									<img className='share-icon' src={shareIcon} alt="share icon"></img>
								</div>
								<Themes
									themes={this.state.themes}
									filterByTheme={this.filterByTheme}
									projectId={this.state.projectId}
									deleteTheme={this.deleteTheme}
									filtering={this.state.filtering}
									clearFilters={this.clearFilters}
									showModal={() => this.showModal('theme')}
									showThemesStatus={this.state.showThemesStatus}
									showThemes={this.showThemes}
									hideThemes={this.hideThemes}
								/>
								{this.state.timeboxes.length === 1 &&
									<div className='component-container mb-2'>
										<div className='component-title'>
											<span>Timebox</span>
											<AddTimebox
												projectId={this.state.projectId}
												updateTimeboxes={this.newAddTimebox}
											/>
										</div>
										<TimeboxesExplainer />
									</div>
								}
								<Timeboxes
									deleteTimebox={this.deleteTimebox}
									editTimebox={this.editTimebox}
									timeboxes={this.state.timeboxes}
									tasks={this.state.visibleTasks.filter(t => t.timebox !== 'Backlog')}
									projectId={this.state.projectId}
									updateTimeboxStatus={this.updateTimeboxStatus}
								/>
								<Backlog
									projectId={this.state.projectId}
								 	tasks={this.state.visibleTasks}
								  	deleteTask={this.deleteTask}
									themes={this.state.themes}
									editTask={this.editTask}
									showAddTaskModal={() => this.showModal('task')}
									title='Backlog'
								/>
								<Modal 
									show={this.state.showModalStatus} 
									hide={this.hideModal}
									projectId={this.state.projectId}
									addTask={this.addTask}
									addTheme={this.addTheme}
								/>
						 	</div>
						</DragDropContext>
						)
					: <div></div>
	}
}


export { Board }
