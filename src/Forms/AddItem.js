import React, {useState} from 'react'
import { postRequest }from './../API/api.js'


const AddTimebox = ({onSubmit, projectId, updateTimeboxes}) => {
	const [title, setTitle] = useState('');
	const [goal, setGoal] = useState('')


	const addTimebox = (event) => {
		event.preventDefault()
		updateTimeboxes(title, goal)
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


const AddTask = ({ updateTasks, cta}) => {
	const [title, setTitle] = useState('');

	const addTask = (event) => {
		event.preventDefault()
		updateTasks(title)
	  };

	return (
	    <Form
	      onSubmit={addTask}
	      cta={cta}
	    >
	      <FullWidthInputField value={title} onChange={setTitle} placeholder={cta}>
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
	<h1 className="text-center mt-2  mb-2">{cta}</h1>
    <div className="row mb-3 mt-3">
		{children}
	</div>
	<div className='row'>
		<div className='col-6 mx-auto text-center'>
			<input className='btn btn-primary mb-5' type="submit" value={cta}/>
		</div>
	</div>
  </form>
);


const FullWidthInputField = ({ value, onChange, children, placeholder }) => (
    <div className='col-10 mx-auto'>
		<input className='form-control' placeholder={placeholder} value={value} type="text" onChange={event => onChange(event.target.value)}/>
	</div>
);

export {AddTheme, AddTask, AddTimebox}
