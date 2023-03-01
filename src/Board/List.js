import { Board } from "./Board";
import { DragDropContext } from 'react-beautiful-dnd';
import Themes from './../Themes/Themes.js'
import Backlog from './../Backlog/Backlog.js'
import Modal from './../Forms/Modal';
import shareIcon from './../img/share_icon.png';

class List extends Board {
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

export  { List }