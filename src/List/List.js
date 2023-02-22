import React from 'react';
import 'bootstrap';
import { getRequest, postRequest }from './../API/api.js'
import { DragDropContext } from 'react-beautiful-dnd';
import Themes from './../Themes/Themes.js'
import Backlog from './../Backlog/Backlog.js'
import Modal from './../Forms/Modal';
import shareIcon from './../img/share_icon.png';


class List extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        dataReceived: false,
			showModalStatus: false,
			showThemesStatus: false
	    };
	}
	  
	getTasks = async (projectId) => {
	const resp = await getRequest('/get_tasks', `project_id=${projectId}`)
	const themes = resp.data['themes']
	this.setState({ 
		projectTitle: resp.data['project_title'],
		tasks: resp.data['tasks'],
		visibleTasks: resp.data['tasks'],
		themes:themes,
		});
	}

	 async componentDidMount() {
		 const sp = new URLSearchParams(this.props.location.query);
		  const projectId = Number(sp.get("projectId"))
		  if (projectId === null || projectId === 0) {
			  this.props.history.push('/')
		  } else {
			  this.setState({projectId: projectId})
			  await this.getTasks(projectId);
              this.setState({dataReceived: true})
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
		this.setState({showThemesStatus: false})
	
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
								<Backlog
									projectId={this.state.projectId}
								 	tasks={this.state.visibleTasks}
								  	deleteTask={this.deleteTask}
									themes={this.state.themes}
									editTask={this.editTask}
									showAddTaskModal={() => this.showModal('item')}
                                    title='List'
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


export { List }
