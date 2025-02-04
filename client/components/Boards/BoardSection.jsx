
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '/styles/board.css';
import ConfirmationPopup from '../ConfirmationPopup';

export function BoardSection({ projectId, boards, setBoards, activeBoard, setActiveBoard }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });

  // Function to reset and hide the popup overlay
  const resetPopupOverlay = () => {
    setPopupVisible(false);
    setNewBoard({ name: '', description: '' }); // Reset the input fields
  };

  const createBoard = (event) => {
    event.preventDefault();
    if (newBoard.name.trim()) {
      const newBoardData = {
        id: uuidv4(),
        name: newBoard.name,
        description: newBoard.description,
      };


      const newBoardDat = {
        name: newBoard.name,
        description: newBoard.description,
      };
      fetch(`/.proxy/api/api/v1/projects/${projectId}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.token,
        },
        body: JSON.stringify(newBoardDat)

      }).then(x => x.json()).then(x => {
        const newBoardData = {
          id: x.boardId,
          name: newBoard.name,
          description: newBoard.description,
        };
        setBoards((prevBoards) => ({
          ...prevBoards,
          [projectId]: [...(prevBoards[projectId] || []), newBoardData],
        }));
      })
        .catch(e => {console.log(e);
      setBoards((prevBoards) => ({
        ...prevBoards,
        [projectId]: [...(prevBoards[projectId] || []), newBoardData],
      }));}
    );
  resetPopupOverlay();
} else {
  alert('Please enter a board name.');
}
  };

// Function to handle board selection
const handleSelectBoard = (board) => {
  setActiveBoard(board);
};

// Function to show the confirmation popup
const handleShowConfirmation = () => {
  setConfirmationVisible(true);
};

return (
  <div className="board-section" id={`board-section-${projectId}`}>
    <span className="board-text" id="board-text">Boards</span>

    <div id="create-board-container">
      <button id="create-board-button" onClick={() => setPopupVisible(true)}>
        + Create New Board
      </button>
    </div>

    <div id="board-list-container" className='board-list-container'>
      {boards.map((board) => (
        <button
          key={board.id}
          className={`board-button ${activeBoard && activeBoard.id === board.id ? 'active' : ''}`}
          onClick={() => handleSelectBoard(board)}
        >
          {board.name}
        </button>
      ))}
    </div>

    {/* Board Popup */}
    {popupVisible && (
      <div className="popup-overlay" id="popup-overlay" onClick={handleShowConfirmation}>
        <div className="popup-content" id="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="header-title" id="header-title">Create New Board</div>
          <button
            className="close-popup-button"
            id="close-popup-button"
            onClick={handleShowConfirmation}
          >
            ✖
          </button>

          {/* Scrollable body */}
          <div className="popup-body">
            <div className="input-wrapper">
              <label htmlFor="board-name" className="popup-label">Board Name</label>
              <input
                className="popup-input"
                id="board-name"
                type="text"
                placeholder="Enter Board Name"
                value={newBoard.name}
                onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="board-description" className="popup-label">Board Description</label>
              <textarea
                className="popup-textarea"
                id="board-description"
                placeholder="Enter Board Description (Optional)"
                value={newBoard.description}
                onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
              />
            </div>
          </div>

          <div className="popup-buttons" id="popup-buttons">
            <button
              className="cancel-button"
              id="cancel-button"
              onClick={handleShowConfirmation}
            >
              Cancel
            </button>
            <button
              className="create-board-button-form"
              id="create-board-button-form"
              onClick={createBoard}
            >
              Create Board
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Confirmation Popup */}
    {confirmationVisible && (
      <ConfirmationPopup
        isVisible={confirmationVisible}
        onConfirm={() => {
          setConfirmationVisible(false); // Close the confirmation popup
          resetPopupOverlay(); // Close the board popup and reset inputs
        }}
        onCancel={() => setConfirmationVisible(false)} // Just close the confirmation popup
      />
    )}
  </div>
);
}

export default BoardSection;
