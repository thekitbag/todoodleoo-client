import React from 'react';
import 'bootstrap';
import axios from 'axios';
import './board.css';
import Themes from './../Themes/Themes.js'
import Backlog from './../Backlog/Backlog.js'
import Timeboxes from './../Timeboxes/Timeboxes.js'
import { DragDropContext } from 'react-beautiful-dnd';

class Board extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        dataReceived: false
	    };
	  }

	addTask = (taskData) => {
		const newTask = {...taskData}
		this.setState(prevState => ({
    		tasks: [newTask, ...this.state.tasks],
    		visibleTasks: [newTask, ...this.state.tasks]
    	}));
  	};

  	addTimebox = (timebox) => {
  		this.setState(prevState => ({
    		timeboxes: [...this.state.timeboxes, timebox]
    	}));
  	}

  	addTheme = (themeData) => {
  		this.setState(prevState => ({
    		themes: [...this.state.themes, themeData],
    		}));
  	}

  	deleteTask = (taskId) => {
  		axios.post('/delete_task', {
  			task_id: taskId,
  			project_id: this.state.projectId
  		})
  		const tasks = this.state.tasks.filter(t => t.id !== taskId)
  		this.setState(prevState => ({
		    	tasks: tasks,
		    	visibleTasks: tasks
		    }));
  	}

  	deleteTheme = (themeId) => {
  		axios.post('/delete_theme', {
  			theme_id: themeId,
  			project_id: this.state.projectId
  		})
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

  	getTasks = async (projectId) => {
    const resp = await axios.get(`/get_tasks?project_id=${projectId}`)
    const timeboxes = resp.data['timeboxes']
    const themes = resp.data['themes']
    this.setState({ tasks: resp.data['tasks'],
    								visibleTasks: resp.data['tasks'], 
    								themes:themes, 
    								timeboxes: timeboxes 
    							});
  };

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
  			axios.post('/update_task_theme', {
  			project_id: this.state.projectId,
  			task_id: taskId,
  			theme_id: themeId
  			})

	  		const themeObj = this.state.themes.find(o => o.id === themeId)

	  		obj.theme = themeObj.title
	  		obj.theme_color = themeObj.color

  		} 

  		else if (destination.droppableId.slice(0,7) === 'Timebox') {
  			//landed in a timebox - get timebox, remove from tasks, update timebox and put back in new position
  			const timebox = destination.droppableId.slice(8,)

  			axios.post('/update_task', {
	  			project_id: this.state.projectId,
	  			task_id: taskId,
	  			priority: result.destination.index,
	  			timebox: timebox
	  		})

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
  		  axios.post('/update_task', {
  			project_id: this.state.projectId,
  			task_id: taskId,
  			priority: result.destination.index,
  			timebox: destination.droppableId
  		})
	  	
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
							<div className='board row mt-5' style={{margin: 0}}>
								<Themes 
									themes={this.state.themes} 
									filterByTheme={this.filterByTheme} 
									projectId={this.state.projectId}
									addTheme={this.addTheme}
									deleteTheme={this.deleteTheme}
									filtering={this.state.filtering}
									clearFilters={this.clearFilters}
								/>
								<Backlog 
									projectId={this.state.projectId}
								  tasks={this.state.visibleTasks}
								  addTask={this.addTask}
								  deleteTask={this.deleteTask}
								/>
								<Timeboxes 
									addTimebox={this.addTimebox}
									timeboxes={this.state.timeboxes}
									tasks={this.state.visibleTasks}
									projectId={this.state.projectId}
								/>		
						 	</div>
						</DragDropContext> 
						)
					: <div></div>
	}
}


export { Board }
