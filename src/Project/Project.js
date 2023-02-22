import React from 'react';
import { getRequest, postRequest }from './../API/api.js'
import './project.css';
import { Link } from 'react-router-dom';


const BoardButton = (props) => {
	return 	<div className='card project-card mt-2 mb-3'>
				<Link className='card-link' to={{pathname: '/board',
														query: {projectId: props.project.project_id}}}>{props.project.project_title}</Link>
			</div>
}

const ListButton = (props) => {
	return 	<div className='card project-card mt-2 mb-3'>
						<Link className='card-link' to={{pathname: '/list',
																query: {projectId: props.project.project_id}}}>{props.project.project_title}</Link>
					</div>
}

class Boards extends React.Component {
	render() {
		return <div className='row'>
					<div className='col-10 text-center mx-auto mt-2 border-secondary'>
						<h3> Your Boards </h3>
						<div className='container mt-4'>
							{this.props.boards.map( project =>
								<BoardButton
									project={project}
									key={project.project_id}
								/>
								)}
						</div>
					</div>
				</div>
	}
}

class Lists extends React.Component {
	render() {
		return <div className='row'>
					<div className='col-10 text-center mx-auto mt-2 border-secondary'>
						<h3> Your Lists </h3>
						<div className='container mt-4'>
							{this.props.lists.map( project =>
								<ListButton
									project={project}
									key={project.project_id}
								/>
								)}
						</div>
					</div>
				</div>

	}
}

class AddProject extends React.Component {
	state = {title: '', project_type: 'board'}

	handleSubmit = (event) => {
		event.preventDefault()
		const data = {
			title: this.state.title,
			project_type: this.state.project_type
		}
		postRequest('/add_project', data)
		.then( (response) => {
			this.props.addProject(response.data.projects)
			this.setState({title: ''})
		}, (error) => {
	      console.log(error)
	    });
	}

	render() {
		return <div className='row'>
					<div className='col-10 text-center mx-auto mt-2 border-secondary'>
						<h3> Add New Project</h3>
					</div>
						<div className='col-6 mx-auto mt-3'>
						 <form onSubmit={this.handleSubmit}>
						 	<div className='form-group'>
								<input
									className='form-control form-control-sm mb-2 text-center'
									type="text"
									value={this.state.title}
									onChange={event => this.setState({ title: event.target.value })}
									placeholder='New Project Name'
									required
								/>
								<select 
									className="form-select" aria-label="Project Type Select"
									name="project_types" 
									id="project_types"
									onChange={event => this.setState({ project_type: event.target.value })}
									placeholder='Project Type'
									label="Project Type"
									required
								>
									<option value="" defaultValue="">Project Type</option>
									<option value="board">Board</option>
									<option value="list">List</option>
								</select>
				        	</div>
				        	<div className='col text-center'>
								<button className='btn btn-primary mx-auto mb-4 mt-1'>Add Project</button>
							</div>
						 </form>
						</div>
					 </div>
	}
}

class App extends React.Component {
	state = {projects: [], dataReceived: false}

	addProject = (projectsData) => {
		this.setState(prevState => (
			{projects: projectsData}))
	}

	getProjects = async () => {
		try {
			await getRequest('/get_projects')
	    .then((response) => {
		      const projectsList = response.data['projects']
			  const boards = projectsList.filter(p => p.project_type === 'board')
			  const lists = projectsList.filter(p => p.project_type === 'list')
	    		this.setState({boards: boards});
				this.setState({lists: lists});
	    		this.setState({dataReceived: true});
		    }, (error) => {
					console.log(error)
		    });

		} catch (err) {
			console.log(err)
		}


  };

  componentDidMount() {
    this.getProjects();
  }

	render() {
		if (this.state.dataReceived === false){
			return <div> <br></br><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
		} else {
			return <div className='projects-list'>
							<Boards boards={this.state.boards}/>
							<Lists lists={this.state.lists} />
							<AddProject addProject={this.addProject} />
						 </div>


		}
	}
}

export default App;
