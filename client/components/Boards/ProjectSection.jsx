import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '/styles/popup.css';
import '/styles/project.css';
import ConfirmationPopup from '../ConfirmationPopup';


export function ProjectSection({ projects, setProjects, activeProject, setActiveProject, setSelectedProject }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const resetPopupOverlay = () => {
    setPopupVisible(false);
    setNewProject({ name: '', description: '' });
  };

  const createProject = (event) => {
    event.preventDefault();
    const projectName = newProject.name.trim();
    const projectDescription = newProject.description.trim();

    if (projectName) {
      const newProjectDat = {
        name: projectName,
        description: projectDescription,
      };
      fetch('/.proxy/api/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.token,
          
        },
        body: JSON.stringify(newProjectDat)

      }).then(data => data.json()).then(data => {
        const newProjectData = {
          id: data.projectId,
          name: projectName,
          description: projectDescription,
        };
        setProjects((prevProjects) => [...prevProjects, newProjectData]);
        resetPopupOverlay();
      }).catch(e => console.log(e));
    } else {
      alert('Please enter a project name.');
    }
  };

  const handleProjectClick = (project) => {
    setActiveProject(project);
  };

  return (
    <div className="project-section" id="project-section">
      <div id="create-project-container">
        <button id="create-project-button" className="create-project-button" onClick={() => setPopupVisible(true)}>
          + Create New Project
        </button>
        <div className="dynamic-line" id="dynamic-line"></div>
      </div>

      <div id="project-list-container">
        {console.log("projects achi: ",JSON.stringify(projects))}
        {
        projects.map((project) => (
          <button
            key={project.id}
            id={`project-button-${project.id}`}
            className={`project-button ${activeProject && activeProject.id === project.id ? 'active' : ''}`}
            onClick={() => handleProjectClick(project)}
          >
            {/* Checkmark/Icon */}
            <span className="checkmark">
              {activeProject && activeProject.id === project.id && '✔'}
            </span>
            {project.name}
          </button>
        ))}
        <div className="dynamic-line1" id="dynamic-line1"></div>
      </div>

      {/* Project Popup */}
      {popupVisible && (
        <div
          className="project-popup-overlay"
          id="project-popup-overlay"
          onClick={() => setConfirmationVisible(true)}
        >
          <div
            className="project-popup"
            id="project-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="header-title" id="header-title">Create New Project</div>
            <button
              className="close-popup-button"
              onClick={() => setConfirmationVisible(true)}
              aria-label="Close project creation popup"
            >
              ✖
            </button>

            <div className="input-wrapper">
              <label htmlFor="project-name" className="popup-label">Project Name</label>
              <input
                className="popup-input"
                id="project-name"
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="project-description" className="popup-label">Project Description (Optional)</label>
              <textarea
                className="popup-textarea"
                id="project-description"
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
              <div className="popup-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  id="cancel-button"
                  onClick={() => setConfirmationVisible(true)}
                  aria-label="Cancel project creation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-project-button-form"
                  id="create-project-button-form"
                  onClick={createProject}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Popup (Fix) */}
      {confirmationVisible && (
        <ConfirmationPopup
          isVisible={confirmationVisible}
          onConfirm={() => {
            setConfirmationVisible(false);
            resetPopupOverlay();
          }}
          onCancel={() => setConfirmationVisible(false)}
        />
      )}
    </div>
  );
}

export default ProjectSection;
