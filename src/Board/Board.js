import React from 'react';
import 'bootstrap';
import './board.css';
import { DragDropContext } from 'react-beautiful-dnd';
import Themes from './../Themes/Themes.js'
import Backlog from './../Backlog/Backlog.js'
import Timeboxes from './../Timeboxes/Timeboxes.js'
import TimeboxesExplainer from '../Explainer/TimeboxesExplainer';
import Modal from './../Forms/Modal';
import { AddTimebox } from './../Forms/AddItem.js';
import shareIcon from './../img/share_icon.png';
import {handleDrop
	} from './dragAndDrop'
import { Create, Read, Update, Delete } from './crud';
import { handleEditTaskResponse } from './responseHandlers';

class Board extends React.Component {
	constructor(props) {
	    super(props);
		this.handleDrop = handleDrop.bind(this)
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
			const r = new Read()
			await r.getTasks(projectId, this);
			this.setState({dataReceived: true});
		}
 	}
	  
	addTask = async (title) => {
		const c = new Create()
		c.addTask(title, this)
	}
	
	deleteTask = async (taskId) => {
		const d = new Delete()
		d.deleteTask(taskId, this)
	}

	editTask = async (taskObj) => {
		const u = new Update()
		let resp = await u.editTask(taskObj)
		handleEditTaskResponse(resp, this)
	}

	addTimebox = async (title, goal) => {
		const c = new Create()
		c.addTimebox(title, goal, this)
	}

	deleteTimebox = (timeboxId) => {
		const d = new Delete()
		d.deleteTimebox(timeboxId, this)
	}

	editTimebox = (timebox) => {
		const u = new Update()
		u.editTimebox(timebox)
	}

	closeTimebox = (timebox) => {
		const u = new Update()
		u.closeTimebox(timebox)
		this.setState({timeboxes: []})
	}

  	addTheme = (title) => {
		const c = new Create()
		c.addTheme(title, this)
  	}

  	deleteTheme = (themeId) => {
		const d = new Delete()
		d.deleteTheme(themeId, this)
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

	onDragEnd = (result) => {
		this.handleDrop(result)
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
									updateTimeboxes={this.addTimebox}
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
						closeTimebox={this.closeTimebox}
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
			) : <div></div>
	}
}


export { Board }
