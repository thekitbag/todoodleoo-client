import React, {useState} from 'react'
import { postRequest }from './../API/api.js'

const ShareForm = ( {projectId} ) => {
    const [username, setUsername] = useState('');

    const shareProject = (event) => {
		event.preventDefault()
		const data = {
			username: username,
			project_id: projectId
		}
		postRequest('/share_project', data)
	  }


    return <form onSubmit={shareProject}>
                <h1 className="text-center mt-2  mb-2">Share Project</h1>
                <div className="row mb-3 mt-3">
                    <div className='col-10 mx-auto'>
                        <input className='form-control' placeholder='Username' value={username} type="text" onChange={event => setUsername(event.target.value)} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6 mx-auto text-center'>
                        <input className='btn btn-primary mb-1' type="submit" value='Share' />
                    </div>
                </div>
            </form>;
}

  export default ShareForm