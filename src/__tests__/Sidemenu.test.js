import React from 'react';
import ReactDOM from 'react-dom';
import SideMenu from '../sidemenu.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SideMenu boardId={1}
                        epics={[]}
                        themes={[]}
                        timeboxes={[]}
                        filterByStatus= {() => {}}
                        filterByEpic= {() => {}}
                        filterByTimebox= {() => {}} />, div);
});