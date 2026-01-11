import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State management
  // State for storing all tasks
  const [tasks, setTasks] = useState([]);
  // State for the input field
  const [inputValue, setInputValue] = useState('');
  // State for tracking which task is being edited
  const [editingId, setEditingId] = useState(null);
  // State for storing the edit inpurt value
  const [editValue, setEditValue] = useState('');

  // New enhancement states

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []); // Empty array = run only once on mount

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // Run whenever 'tasks' change

  // Add new task
  const addTask = () => {
    // Don't add empty tasks
    if (inputValue.trim() === '') {
      alert('Please enter task!');
      return;
    }

    const newTask = {
      id: Date.now(), // Simple unique ID using timestamp
      text: inputValue,
      completed: false,
    };

    setTasks([...tasks, newTask]); // Add new task to array
    setInputValue(''); // Clear input field
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Toggle task completion status
  const toggleComplete = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Start editing a task
  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditValue(currentText);
  };

  // Save edited task
  const saveEdit = (id) => {
    if (editValue.trim() === '') {
      alert('Task cannot be empty!');
      return;
    }

    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, text: editValue } : task
      )
    );

    setEditingId(null); // Exit edit mode
    setEditValue(''); // Clear edit input
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Handle Enter key in edit mode
  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>My To-Do List</h1>

        {/* Add Task Section */}
        <div className="input-section">
          <input 
            type="text"
            placeholder='Add a new task...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="task-input"
          />
          <button onClick={addTask} className="add-button">
            Add
          </button>
        </div>

        {/* Task List */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-message">No tasks yet. Add one above!</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>

                {/* Checkbox to mark complete */}
                <input 
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="checkbox" 
                />

                {/* Task Text or Edit Input */}
                {editingId === task.id ? (
                  <input 
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                    className="edit-input"
                    autoFocus  
                  />
                ) : (
                  <span className="task-text">{task.text}</span>
                )}

                {/* Action buttons */}
                <div className="task-actions">
                  {editingId === task.id ? (
                    <>
                      <button onClick={() => saveEdit(task.id)} className="save-button">
                        ✓
                      </button>
                      <button onClick={cancelEdit} className="cancel-button">
                        ✗
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(task.id, task.text)} className="edit-button">
                        ✏️
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="delete-button">
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Counter */}
        {tasks.length > 0 && (
          <div className="task-counter">
            <p>
              Total: {tasks.length} | Completed: {tasks.filter(t => t.completed).length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;