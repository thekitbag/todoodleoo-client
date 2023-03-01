import React from 'react';
import styled from 'styled-components';
import deleteIcon from './../img/delete_icon.png';
import expandIcon from './../img/expand_icon.png';
import plusIcon from './../img/plus_icon.png';

import { Droppable } from 'react-beautiful-dnd';
import './themes.css'

const ThemeExplainer = (props) => {
	return 	<div className='col-12 new-user-copy'>
				<div className='container'>
					<p>Themes let you group similar tasks together. Hit '+' to add a new theme.</p>
				</div>
			</div>
}

const Theme = (props) => {
	const theme = String('Theme:' + props.data.id)

	const Container = styled.div`
		border: ${props => (props.isDraggingOver ? '4px solid gold' : 'none')};
		margin-bottom: 6px;
		width: 90%;
		margin-left: 5%;
	`;

	return  <div className={theme}>
				<Droppable droppableId={theme}>
						{(provided, snapshot) => (
							<Container  className="col-12"
										onClick = {() => props.filterByTheme(props.title)}
										ref={provided.innerRef}
										isDraggingOver={snapshot.isDraggingOver}
							>
								<div className='container theme' style={{backgroundColor: props.data.color}}>
									<div className='theme-title w-100'>
										<span>{props.data.title}</span>
									</div>
									<div className='theme-delete-icon'>
										<img
											alt="delete-icon"
											className='delete-icon'
											onClick={() => props.deleteTheme(props.data.id)}
											src={deleteIcon}
										>
										</img>
									</div>
									{provided.placeholder}
				  				</div>
				  			</Container>
			  		)}
				</Droppable>
			</div>
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
		this.setState({showAddThemeModalStatus: !this.state.showAddThemeModalStatus})
	}

	deleteTheme = (themeId) => {
		this.props.deleteTheme(themeId)
  	};

	clearFilters = () => {
		this.props.clearFilters()
	}

	render() {
		if (this.props.showThemesStatus === false) {
			return  <div className='themes-container col-2' id='themes-container'>
						<div className='widget-title'>
							<span>Themes</span>
						</div>
						<img
							alt="expand-icon"
							className='expand-icon'
							onClick={() => this.props.showThemes()}
							src={expandIcon}
						>
						</img>
					</div>
					
		} else {
			return <div className='themes-container-expanded col-6' id='themes-container'>
						<div className='component-title'>
							<span>Themes</span>
						</div>
						<img
							alt="expand-icon"
							className='retract-icon'
							onClick={() => this.props.hideThemes()}
							src={expandIcon}
						>
						</img>
						<div className="themes-holder">
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
						<div className='plus-icon-container text-center'>
							<div className='icon-holder'>
							<img
								alt="plus-icon"
								className='plus-icon'
								onClick={() => this.props.showModal()}
								src={plusIcon}
							></img>
							</div>
						</div>
					</div>
					
		}
	}
}

export default Themes
