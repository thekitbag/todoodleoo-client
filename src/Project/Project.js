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

class Boards extends React.Component {
	render() {
		return <div className='row'>
							<div className='col-6 text-center mx-auto mt-5 border-secondary'>
								<h2> Your Boards </h2>
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

class AddProject extends React.Component {
	state = {title: ''}

	handleSubmit = (event) => {
		event.preventDefault()
		const data = {
			title: this.state.title
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
						<div className='col-6 mx-auto mt-3'>
						 <form onSubmit={this.handleSubmit}>
						 	<div className='form-group'>
								<input
									className='form-control form-control-lg m-2'
				          type="text"
				          value={this.state.title}
				          onChange={event => this.setState({ title: event.target.value })}
				          placeholder='Enter New Project Name'
				          required
				        />
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
	    		this.setState({projects: projectsList});
	    		this.setState({dataReceived: true})
		    }, (error) => {
					console.log(error)
		    });

		} catch (err) {
			window.location = '/login'
		}


  };

  componentDidMount() {
    this.getProjects();
  }

	render() {
		if (this.state.dataReceived === false){
			return <div>loading</div>
		} else {
			return <div className='projects-list'>
							<Boards boards={this.state.projects}/>
							<AddProject addProject={this.addProject} />
						 </div>


		}
	}
}

export default App;
