//this is where onDragEnd will live when you have worked out how to import a function
//and use it inside a class, and have it update the state of that class
import { postRequest }from './../API/api.js'

const handleThemeDrop = (destination, taskId, obj, cls) => {
    const themeId = Number(destination.droppableId.slice(6,11))
        const data = {
            project_id: cls.state.projectId,
            task_id: taskId,
            theme_id: themeId
        }
        postRequest('/update_task_theme', data)

        const themeObj = cls.state.themes.find(o => o.id === themeId)

        obj.theme = themeObj.title
        obj.theme_color = themeObj.color

        cls.setState({showThemesStatus: false})
}

const handleTimeboxDrop = (destination, result, taskId, obj, cls) => {
    const timebox = destination.droppableId.slice(8,)
    const data = {
        project_id: cls.state.projectId,
        task_id: taskId,
        priority: result.destination.index,
        timebox: timebox
    }
    postRequest('/update_task', data)

    obj.timebox = timebox

    const newTasks = cls.state.tasks.filter(t => t !== obj)
        newTasks.splice(result.destination.index,0, obj)
        cls.setState({
        tasks: newTasks,
        visibleTasks: newTasks
        })
}

const handleBacklogDrop = (destination, result, taskId, cls) => {
    const data = {
        project_id: cls.state.projectId,
        task_id: taskId,
        priority: result.destination.index,
        timebox: destination.droppableId
        }
        postRequest('/update_task', data)
}

const handleSameListReorder = (source, result, obj, cls) => {
    let backlogTasks = cls.state.tasks.filter(t => t.timebox === source.droppableId);
        backlogTasks = cls.state.tasks.filter(t => t !== obj);
        backlogTasks.splice(result.destination.index,0, obj)
        cls.setState({
        tasks: backlogTasks,
        visibleTasks: backlogTasks
        })
}

const handleMoveBackToBacklogDrop = (obj, cls, otherTasks, destinationList) => {
    obj.timebox = 'Backlog'

    cls.setState({
    tasks: [...otherTasks, ...destinationList],
    visibleTasks: [ ...otherTasks, ...destinationList]
    })
}

const handleDrop = function (result) {
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

export { handleDrop };