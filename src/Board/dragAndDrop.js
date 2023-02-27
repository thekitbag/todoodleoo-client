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

export { handleThemeDrop,
    handleTimeboxDrop,
    handleBacklogDrop,
    handleSameListReorder,
    handleMoveBackToBacklogDrop };