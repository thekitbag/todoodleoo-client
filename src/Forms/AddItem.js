import React, {useState} from 'react'
import { postRequest }from './../API/api.js'


const AddTimebox = ({onSubmit, projectId, updateTimeboxes}) => {
	const [title, setTitle] = useState('');
	const [goal, setGoal] = useState('')

	const addTimebox = (event) => {
		event.preventDefault()
		const data = {
			project_id: projectId,
			title: title,
			goal: goal
		}
		postRequest('/add_timebox', data)
		.then((response) => {
			updateTimeboxes(response.data)
			setTitle('')
			setGoal('')
		}, (error) => {
		  console.log(error);
		});
	}
	return (
	    <Form
	      onSubmit={addTimebox}
	      cta='Add Timebox'
	    >
	      <FullWidthInputField value={title} onChange={setTitle} placeholder={'Timebox Name'}>
	      </FullWidthInputField>
		  <FullWidthInputField value={goal} onChange={setGoal} placeholder={'Goal'}>
	      </FullWidthInputField>
	
	    </Form>
	  );
	};


const AddTask = ({closeModal, projectId, updateTasks}) => {
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
			closeModal()
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

const AddTheme = ({ closeModal, projectId, updateThemes }) => {
	  const [title, setTitle] = useState('');

	  const addTheme = async (event) => {
	  	event.preventDefault()
			const data = {
			  title: title,
			  project_id: projectId
			  }
				postRequest('/add_theme', data)
				.then((response) => {
				  updateThemes(response.data);
				  closeModal()


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
    <div className="row mb-3 mt-3">
		{children}
	</div>
	<div className='row'>
		<div className='col-6 mx-auto text-center'>
			<input className='btn btn-primary mb-1' type="submit" value={cta}/>
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
	const [f1, f2, f3] = [changeFunctions[0], changeFunctions[1], changeFunctions[2]]
	return  <div className='col-12 mx-auto mt-2 goals-group'>
				<input className='form-control' placeholder={p1} value={v1} type="text" onChange={event => f1(event.target.value)}/>
				<input className='form-control' placeholder={p2} value={v2} type="text" onChange={event => f2(event.target.value)}/>
				<input className='form-control' placeholder={p3} value={v3} type="text" onChange={event => f3(event.target.value)}/>
			</div>
};

export {AddTheme, AddTask, AddTimebox}
