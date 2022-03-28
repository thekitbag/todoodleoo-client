import React from 'react';
import styled from 'styled-components';
import deleteIcon from './../img/delete_icon.png';
import { Droppable } from 'react-beautiful-dnd';
import { AddTheme } from './../Forms/AddItem.js'
import './themes.css'

const ThemeExplainer = (props) => {
	return 	<div className='col-12 mt-5 new-user-copy'>
						<p>Themes let you group similar tasks together</p>
					</div>
}

const Theme = (props) => {
		const deleteTheme = () => {
		props.deleteTheme(props.data.id)
	}
		const theme = String('Theme:' + props.data.id)

		const Container = styled.div`
			border: ${props => (props.isDraggingOver ? '4px solid gold' : 'none')};
			margin-bottom: 20px;
			width: 100%
		`;

	return  <Droppable droppableId={theme}>
						{(provided, snapshot) => (
							<Container  className="col-12" 
										onClick = {() => props.filterByTheme(props.title)}
										ref={provided.innerRef}
										isDraggingOver={snapshot.isDraggingOver}
							>
								<div 
									
									className='container card theme' 
									style={{backgroundColor: props.data.color}}
								>
									<div  
										className='theme-title'
									>
										<span>
											{props.data.title}
										</span>
									</div>
									<div className='theme-delete-icon'>
										<img 
											alt="delete-icon" 
											className='delete-icon' 
											onClick={() => deleteTheme()} 
											src={deleteIcon}
										>
										</img>
									</div>
									{provided.placeholder}
				  			</div>
				  		</Container>
			  		)}
					</Droppable>
}

const ClearFilters = (props) => {
	return <div className="col-12" onClick={props.clearFilters}>
										<div 
											className='container card theme border border-dark col-12' 
											style={{backgroundColor: 'pink', height: 60}}
										>
											<h4 className='add-theme-title'>Clear Filters</h4>
											<h3>x</h3>
										</div>
									</div> 
}


class Themes extends React.Component {

	constructor(props) {
    super(props);

    this.state = {
      themes: this.props.themes,
      showAddThemeModalStatus: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState){
			   if(nextProps.themes !== prevState.themes){
			     return { themes: nextProps.themes};
			  }
			  else return null;
			}

	filterByTheme = (theme) => {
		this.props.filterByTheme(theme);
		if (theme === '') {
			this.setState({filtering: false})
		} else {
			this.setState({filtering: true})
	  }
	}

  showAddThemeModal = () => {
  	this.setState({showAddThemeModalStatus: true})
  }

	deleteTheme = (themeId) => {
		this.props.deleteTheme(themeId)
  };

  clearFilters = () => {
  	this.props.clearFilters()
  }



	render() {
		return  <div className='themes-container col-2' id='themes-container'>
								<div className='component-container'>
									<div className='component-title'>
									  <span>Themes</span>
									</div>
										<AddTheme
										  projectId={this.props.projectId}
											showAddThemeModal={this.showAddThemeModal}
											updateThemes={this.props.addTheme}
										/>
									<div className='row m-2'>
										{this.props.themes.length === 0 &&
											<ThemeExplainer />
										}
										{this.state.themes.map(theme => 
											<Theme 
												projectId={this.props.projectId} 
												key={theme.id} data={theme} 
												filterByTheme={this.filterByTheme}
												title={theme.title}
												deleteTheme={this.deleteTheme}
											/>)}
										{this.props.filtering === true && 
											<ClearFilters clearFilters={this.clearFilters} />
										}
								</div>
						    </div>
							</div>
		}
	}


export default Themes

			