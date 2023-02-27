import { getRequest, postRequest }from './../API/api.js'
import {handleGetTasksResponse,
    handleAddTaskResponse,
    handleDeleteTaskResponse,
    } from './responseHandlers'

const getTasks = async (projectId, cls) => {
    const resp = await getRequest('/get_tasks', `project_id=${projectId}`)
    const stateData = handleGetTasksResponse(resp)
    cls.setState(stateData);
}

const addTask = async (title, cls) => {
    const taskData = {
        title: title,
        project_id: cls.state.projectId
    }
    const resp = await postRequest('/add_task', taskData)
    const stateData = handleAddTaskResponse(resp, cls.state.tasks)
    cls.setState(prevState => (stateData));
    cls.hideModal()
}

const deleteTask = async (taskId, cls) => {
    const data = {
        task_id: taskId,
        project_id: cls.state.projectId
        }
    const resp = await postRequest('/delete_task', data)
    const stateData = handleDeleteTaskResponse(resp, cls.state.tasks)
    cls.setState(prevState => (stateData));
}

const editTask = async (taskObj) => {
    const data = {
        project_id: taskObj.state.projectId,
        id: taskObj.state.id,
        title: taskObj.state.title,
        status: taskObj.state.status,
        theme: taskObj.state.theme,
        timeboxes: taskObj.state.timeboxes,
        priority: taskObj.state.priority
    }
    const resp = await postRequest('/edit_task', data)
    return resp
}

const addTimebox = async (title, goal, cls) => {
    const data = {
        project_id: cls.state.projectId,
        title: title,
        goal: goal
    }
    const resp = await postRequest('/add_timebox', data)
    console.log('abc')
    const timebox = resp.data
    cls.setState(prevState => ({
        timeboxes: [...cls.state.timeboxes, timebox]
    }));
}

export {getTasks, addTask, deleteTask, editTask, addTimebox}
