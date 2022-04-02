import React, {useState} from 'react'
import { postRequest }from './../API/api.js'


const AddTimebox = ({onSubmit, projectId, updateTimeboxes}) => {
	const [title, setTitle] = useState('');
	const [goalOne, setGoalOne] = useState('')
	const [goalTwo, setGoalTwo] = useState('')
	const [goalThree, setGoalThree] = useState('')
	const changeFunctions = [setGoalOne, setGoalTwo, setGoalThree]
	const values = [goalOne, goalTwo, goalThree]
	const placeholders = ['Goal One', 'Goal Two', 'Goal Three']

	const addTimebox = (event) => {
		event.preventDefault()
		const goals = [goalOne, goalTwo, goalThree]
		const data = {
			project_id: projectId,
			title: title,
			goals: goals
		}
		postRequest('/add_timebox', data)
		.then((response) => {
			updateTimeboxes(response.data)
		}, (error) => {
		  console.log(error);
		});
	}
	return (
	    <Form
	      onSubmit={addTimebox}
	      cta='Add Task'
	    >
	      <FullWidthInputField value={title} onChange={setTitle} placeholder={'Timebox Name'}>
	      </FullWidthInputField>
	      <TripleInput values={values} changeFunctions={changeFunctions} placeholders={placeholders}>
	      </TripleInput>
	    </Form>
	  );
	};


const AddTask = ({onSubmit, projectId, updateTasks}) => {
	const [title, setTitle] = useState('');

	const addTask = async (event) => {
		event.preventDefault()
		const data = {
			title: title,
			project_id: projectId
		}
		postRequest('/add_task', data)
	    .then((response) => {
	    	const taskData = response.data.tasks[0]
	    	setTitle('')
			updateTasks(taskData)
		}, (error) => {
			console.log(error);
		});
	  };

	return (
	    <Form
	      onSubmit={addTask}
	      cta='Add Task'
	    >
	      <FullWidthInputField value={title} onChange={setTitle} placeholder={'Task Name'}>
	      </FullWidthInputField>

	    </Form>
	  );
	};

const AddTheme = ({ onSubmit, projectId, updateThemes }) => {
	  const [title, setTitle] = useState('');

	  const addTheme = async (event) => {
	  	event.preventDefault()
			const data = {
			  title: title,
			  project_id: projectId
			  }
				postRequest('/add_theme', data)
				.then((response) => {
				  updateThemes(response.data)
				}, (error) => {
				  console.log(error);
				});
				setTitle('')
		}

	  return (
	    <Form
	      onSubmit={addTheme}
	      cta='Add Theme'
	    >
	      <FullWidthInputField value={title} onChange={setTitle} placeholder={'Theme Name'}>
	      </FullWidthInputField>
	    </Form>
	  );
	};

const Form = ({ onSubmit, cta, children }) => (
  <form onSubmit={onSubmit}>
    <div className="row mb-3">
		{children}
	</div>
	<div className='row'>
		<div className='col-6 mx-auto text-center'>
			<input className='btn btn-primary mb-2' type="submit" value={cta}/>
		</div>
	</div>
  </form>
);


const FullWidthInputField = ({ value, onChange, children, placeholder }) => (
    <div className='col-10 mx-auto'>
		<input className='form-control' placeholder={placeholder} value={value} type="text" onChange={event => onChange(event.target.value)}/>
	</div>
);

const TripleInput = ({ values, changeFunctions, children, placeholders }) => {
	const [p1, p2, p3] = [placeholders[0], placeholders[1], placeholders[2]]
	const [v1, v2, v3] = [values[0], values[1], values[2]]
	console.log(changeFunctions)
	const [f1, f2, f3] = [changeFunctions[0], changeFunctions[1], changeFunctions[2]]
	return  <div className='col-12 mx-auto mt-2 goals-group'>
				<input className='form-control' placeholder={p1} value={v1} type="text" onChange={event => f1(event.target.value)}/>
				<input className='form-control' placeholder={p2} value={v2} type="text" onChange={event => f2(event.target.value)}/>
				<input className='form-control' placeholder={p3} value={v3} type="text" onChange={event => f3(event.target.value)}/>
			</div>
};

export {AddTheme, AddTask, AddTimebox}
