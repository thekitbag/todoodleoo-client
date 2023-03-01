import { getRequest, postRequest }from '../API/api.js'
import {handleGetTasksResponse,
    handleAddTaskResponse,
    handleDeleteTaskResponse,
    } from './responseHandlers'

class Update {
    closeTimebox = (timeboxObj, boardObj) => {
        const data = {
            project_id: timeboxObj.props.projectId,
            timebox_id: timeboxObj.props.id,
            status: 'Closed'
        }
        postRequest('/update_timebox_status', data)
    }

    editTimebox = (timeboxObj) => {
        timeboxObj.setState({editing: false})
        const data = {
            project_id: timeboxObj.props.projectId,
            timebox_id: timeboxObj.props.id,
            title: timeboxObj.state.title,
            goal: timeboxObj.state.goal
        }
        postRequest('/edit_timebox', data)        
    }

    editTask = async (taskObj) => {
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
}

class Read {
    getTasks = async (projectId, cls) => {
        const resp = await getRequest('/get_tasks', `project_id=${projectId}`)
        const stateData = handleGetTasksResponse(resp)
        cls.setState(stateData);
    }
}

class Create {
    addTimebox = async (title, goal, cls) => {
        const data = {
            project_id: cls.state.projectId,
            title: title,
            goal: goal
        }
        const resp = await postRequest('/add_timebox', data)
        const timebox = resp.data
        cls.setState(prevState => ({
            timeboxes: [...cls.state.timeboxes, timebox]
        }));
    }

    addTask = async (title, cls) => {
        const taskData = {
            title: title,
            project_id: cls.state.projectId
        }
        const resp = await postRequest('/add_task', taskData)
        const stateData = handleAddTaskResponse(resp, cls.state.tasks)
        cls.setState(prevState => (stateData));
        cls.hideModal()
    }

    addTheme = async (title, boardObj) => {
        const data = {
        title: title,
        project_id: boardObj.state.projectId
        }
        const resp = await postRequest('/add_theme', data)
        boardObj.hideModal()
  		boardObj.setState(prevState => ({
    		themes: [...boardObj.state.themes, resp.data],
    		}));
    }
}

class Delete {
    deleteTimebox = (timeboxId,cls) => {
        const data = {
            project_id: cls.state.projectId,
            timebox_id: timeboxId
        }
        postRequest('/delete_timebox', data)
        const timeboxes = cls.state.timeboxes.filter(tb => tb.id !== timeboxId)
        cls.setState({timeboxes: timeboxes})
    }

    deleteTask = async (taskId, cls) => {
        const data = {
            task_id: taskId,
            project_id: cls.state.projectId
            }
        const resp = await postRequest('/delete_task', data)
        const stateData = handleDeleteTaskResponse(resp, cls.state.tasks)
        cls.setState(prevState => (stateData));
    }

    deleteTheme = (themeId, boardObj) => {
        const data = {
            theme_id: themeId,
            project_id: boardObj.state.projectId
        }
        postRequest('/delete_theme', data)
        const themes = boardObj.state.themes.filter(t => t.id !== themeId)
        boardObj.setState(prevState => ({
            themes: themes,
        }));
    }
}

export {Read, Create, Update, Delete}
