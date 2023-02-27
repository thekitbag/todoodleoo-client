const handleGetTasksResponse = (resp) => {
    const timeboxes = resp.data['timeboxes']
    const themes = resp.data['themes']
    const title = resp.data['project_title']
    const tasks = resp.data['tasks']
    const data = {
        projectTitle: title,
        tasks: tasks,
        visibleTasks: tasks,
        themes:themes,
        timeboxes: timeboxes
    }
    return data
}

const handleAddTaskResponse = (resp, otherTasks) => {
    const data = {
        tasks: [resp.data.tasks[0], ...otherTasks],
        visibleTasks: [resp.data.tasks[0], ...otherTasks]
    }
    return data
}

const handleDeleteTaskResponse = (resp, otherTasks) => {
    const taskId = resp.data['tasks'][0].id
    const tasks = otherTasks.filter(t => t.id !== taskId)
    const data = {
        tasks: tasks,
        visibleTasks: tasks
    }
    return data
}

const handleEditTaskResponse = (resp, boardComponent) => {
    const taskId = resp.data.tasks[0]['id']
    const themeName = resp.data.tasks[0]['theme']
    const task = boardComponent.state.tasks.find(t => t.id === taskId)
    const idx = boardComponent.state.tasks.indexOf(task)
    const theme = boardComponent.state.themes.find(th => th.title === themeName)
    let tasks = boardComponent.state.tasks
    let vtasks = boardComponent.state.visibleTasks
    if (themeName !== 'No Theme') {
        task.theme = theme.title
        task.theme_color = theme.color
    }
    tasks.splice(idx,1,task)
    vtasks.splice(idx,1,task)
    boardComponent.setState({tasks: tasks, visibleTasks:vtasks})

}

export { handleGetTasksResponse, handleAddTaskResponse, handleDeleteTaskResponse, handleEditTaskResponse } ;