import React from 'react';
import 'bootstrap';
import './board.css';
import { getRequest, postRequest }from './../API/api.js'
import { DragDropContext } from 'react-beautiful-dnd';
import Themes from './../Themes/Themes.js'
import Backlog from './../Backlog/Backlog.js'
import Timeboxes from './../Timeboxes/Timeboxes.js'
import TimeboxesExplainer from '../Explainer/TimeboxesExplainer';
import Modal from './../Forms/Modal';
import { AddTimebox } from './../Forms/AddItem.js';
import shareIcon from './../img/share_icon.png';


class Board extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        dataReceived: false,
			showModalStatus: false
	    };
	}
	  
	getTasks = async (projectId) => {
	const resp = await getRequest('/get_tasks', `project_id=${projectId}`)
	const timeboxes = resp.data['timeboxes']
	const themes = resp.data['themes']
	this.setState({ 
		projectTitle: resp.data['project_title'],
		tasks: resp.data['tasks'],
		visibleTasks: resp.data['tasks'],
		themes:themes,
		timeboxes: timeboxes
		});
	}
	
	checkForInProgressTimeboxes = (timeboxes) => {
		timeboxes.forEach(timebox => {
	  if (timebox.status === 'In Progress') {
		  this.setState({timeboxRedirect: timebox.id, ipTimeboxName: timebox.title})
	  }
	  this.setState({dataReceived: true})
	  })
	}

	 async componentDidMount() {
		 const sp = new URLSearchParams(this.props.location.query);
		  const projectId = Number(sp.get("projectId"))
		  if (projectId === null || projectId === 0) {
			  this.props.history.push('/')
		  } else {
			  this.setState({projectId: projectId})
			  await this.getTasks(projectId);
			  this.checkForInProgressTimeboxes(this.state.timeboxes) //why is this function essential for rendrering anything????
		  }

  }
	
	addTask = (taskData) => {
		this.hideModal()
		const newTask = {...taskData}
		this.setState(prevState => ({
			tasks: [newTask, ...this.state.tasks],
			visibleTasks: [newTask, ...this.state.tasks]
			}));
	};
	
	deleteTask = (taskId) => {
		const data = {
		  task_id: taskId,
		  project_id: this.state.projectId
	  	}
		postRequest('/delete_task', data)
	  	const tasks = this.state.tasks.filter(t => t.id !== taskId)
		this.setState(prevState => ({
				tasks: tasks,
				visibleTasks: tasks
		}));
	}
	
	editTask = (taskId, themeName) => {
		const task = this.state.tasks.find(t => t.id === taskId)
		const idx = this.state.tasks.indexOf(task)
		const theme = this.state.themes.find(th => th.title === themeName)
		let tasks = this.state.tasks
		let vtasks = this.state.visibleTasks
		if (themeName !== 'No Theme') {
			task.theme = theme.title
			task.theme_color = theme.color
		}
		tasks.splice(idx,1,task)
		vtasks.splice(idx,1,task)
		this.setState({tasks: tasks, visibleTasks:vtasks})
	};

  	addTimebox = (timebox) => {
  		this.setState(prevState => ({
    		timeboxes: [...this.state.timeboxes, timebox]
    	}));
  	}

	deleteTimebox = (timeboxId) => {
		const timeboxes = this.state.timeboxes.filter(tb => tb.id !== timeboxId)
		this.setState({timeboxes: timeboxes})
	}

	editTimebox = (timeboxId, timeboxData) => {
		console.log(timeboxData)
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
		this.getTasks(this.state.projectId)
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
			const themeId = Number(destination.droppableId.slice(6,11))
			  const data = {
				project_id: this.state.projectId,
				task_id: taskId,
				theme_id: themeId
			  }
			  postRequest('/update_task_theme', data)
	
			const themeObj = this.state.themes.find(o => o.id === themeId)
	
			obj.theme = themeObj.title
			obj.theme_color = themeObj.color
	
		}
	
		else if (destination.droppableId.slice(0,7) === 'Timebox') {
			//landed in a timebox - get timebox, remove from tasks, update timebox and put back in new position
			const timebox = destination.droppableId.slice(8,)
			  const data = {
				  project_id: this.state.projectId,
				  task_id: taskId,
				  priority: result.destination.index,
				  timebox: timebox
			  }
			  postRequest('/update_task', data)
	
			obj.timebox = timebox
	
			const newTasks = this.state.tasks.filter(t => t !== obj)
			  newTasks.splice(result.destination.index,0, obj)
			  this.setState({
			  tasks: newTasks,
			  visibleTasks: newTasks
			  })
		  }
	
		  else if (destination.droppableId === 'Backlog') {
			  //landed in backlog - remove from source list, add to backlog and update state with all the updated lists
			  const data = {
				project_id: this.state.projectId,
				task_id: taskId,
				priority: result.destination.index,
				timebox: destination.droppableId
			}
			  postRequest('/update_task', data)
	
		const destinationList = this.state.tasks.filter(t => t.timebox === destination.droppableId);
		const otherTasks = this.state.tasks.filter(t => t.timebox !== destination.droppableId);
	
		  if (source.droppableId === destination.droppableId) {
			  //same list so simply take it out and put it bakc in new position
			  let backlogTasks = this.state.tasks.filter(t => t.timebox === source.droppableId);
			  backlogTasks = this.state.tasks.filter(t => t !== obj);
	
			  backlogTasks.splice(result.destination.index,0, obj)
			  this.setState({
			  tasks: backlogTasks,
			  visibleTasks: backlogTasks
			  })
	
		  } else {
			  //moving from timebox to backlog so remove from source, add to backlog at index and all tasks back to state
			  obj.timebox = 'Backlog'
	
			  this.setState({
			  tasks: [...otherTasks, ...destinationList],
			  visibleTasks: [ ...otherTasks, ...destinationList]
			  })
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
								/>
								{this.state.timeboxes.length === 1 &&
									<div className='component-container mb-2'>
										<div className='component-title'>
											<span>Timebox</span>
											<AddTimebox
												projectId={this.state.projectId}
												updateTimeboxes={this.addTimebox}
											/>
										</div>
										<TimeboxesExplainer />
									</div>
								}
								<Timeboxes
									addTimebox={this.addTimebox}
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
