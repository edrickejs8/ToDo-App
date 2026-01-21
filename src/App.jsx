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
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Load tasks and dark mode preference from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // Run whenever 'tasks' change

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Add a new task with enhanced properties
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
      priority: priority,
      dueDate: dueDate,
      createAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]); // Add new task to array
    setInputValue(''); // Clear input field
    setDueDate('');
    setPriority('medium');
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

  // Clear all completed tasks
  const clearCompleted = () => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      alert('No completed tasks to clear!');
      return;
    }

    if (window.confirm(`Delete ${completedCount} completed task(s)?`)) {
      setTasks(tasks.filter(task => !task.completed));
    }
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

  // Update task priority
  const updatePriority = (id, newPriority) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, priority: newPriority } : task
      )
    );
  };

  // Filter tasks based on completion status
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply completion filter
    if (filter === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Calculated statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  // Check if task is overdue
  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        {/* Header with dark mode toggle */}
        <div className="header">
          <h1>My To-Do List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="dark-mode-toggle"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Statistics Dashboard */}
        <div className="stats-toggle">
          <button onClick={() => setShowStats(!showStats)} className="toggle-stats-btn">
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>

        {showStats && (
          <div className="stats-dashboard">
            <div className="stat-card">
              <div className="stat-number">{totalTasks}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{activeTasks}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{completedTasks}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card priority-high">
              <div className="stat-number">{highPriorityTasks}</div>
              <div className="stat-label">High Priority</div>
            </div>
            {overdueTasks > 0 && (
              <div className="stat-card overdue">
                <div className="stat-number">{overdueTasks}</div>
                <div className="stat-label">Overdue</div>
              </div>
            )}
          </div>
        )}

        {/* Add Task Section */}
        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Add a new task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="task-input" 
            />

            <div className="task-options">
              <select
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>

              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button onClick={addTask} className="add-button">
            Add Task
          </button>
        </div>

        {/* Search Bar */}
        {tasks.length > 0 && (
          <div className='search-section'>
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        {/* Filter Buttons */}
        {tasks.length > 0 && (
          <div className="filter-section">
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              All ({totalTasks})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            >
              Active {(activeTasks)}
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            >
              Completed {(completedTasks)}
            </button>

            {completedTasks > 0 && (
              <button onClick={clearCompleted} className="clear-completed-btn">
                Clear Completed
              </button>
            )}
          </div>
        )}

        {/* Task List */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="empty-message">
              {searchTerm ? 'No tasks found' : tasks.length === 0 ? 'No tasks yet. Add one above!' : 'No tasks in this category'}
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority} ${isOverdue(task) ? 'overdue-task' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="checkbox"
                />

                <div className="task-content">
                  {editingId === task.id ? (
                    <input 
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                      className="edit-input"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="task-text">{task.text}</span>
                      <div className="task-meta">
                        <select
                          value={task.priority}
                          onChange={(e) => updatePriority(task.id, e.target.value)}
                          className="priority-badge"
                          disabled={task.completed}
                        >
                          <option value="low">🟢 Low</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="high">🔴 High</option>
                        </select>

                        {task.dueDate&& (
                          <span className={`due-date ${isOverdue(task) ? 'overdue' : ''}`}>
                            📅 {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="task-actions">
                  {editingId === task.id ? (
                    <>
                      <button onClick={() => saveEdit(task.id)} className="save-button" title="Save">
                        ✓
                      </button>
                      <button onClick={cancelEdit} className="cancel-button" title="Cancel">
                        ✗
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(task.id, task.text)} className="edit-button" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="delete-button" title="Delete">
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="progress-section">
            <div className="progress-label">
              <span>Progress</span>
              <span>{Math.round((completedTasks / totalTasks) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;