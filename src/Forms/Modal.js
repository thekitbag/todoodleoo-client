import React from 'react';
import ShareBoard from './ShareBoard';
import  {AddTheme, AddTask} from './AddItem';

class Modal extends React.Component {
    hideModal = () => {
        this.props.hide()
    }

    getModalForm = () => {
        if (this.props.show === 'share') {
            return <ShareBoard 
                        projectId={this.props.projectId}
                        hideModal={this.hideModal}
                    />
        } else if (this.props.show === 'task') {
            return <AddTask 
                        projectId={this.props.projectId}
                        updateTasks={this.props.addTask}
                    />
        } else if (this.props.show === 'theme'){
            return <AddTheme 
                        projectId={this.props.projectId}
                        updateThemes={this.props.addTheme}
                   />
        } else {
            return;
        }
        
    }

    modalcontent = () => {
        return <div className='modal-container'>
                    <div className='add-modal-bg' onClick={() => this.hideModal()}>								
                    </div>
                    <div className='add-modal'>
                        {this.getModalForm()}
                    </div>	
                </div>
    }

    render() {
        if (this.props.show === false) {
            return <div></div>
        }
        else {
            return this.modalcontent()
        }      
    }
}

export default Modal
