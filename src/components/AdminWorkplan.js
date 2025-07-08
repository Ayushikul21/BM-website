import React, { useState, useEffect } from 'react';

const AdminWorkplan = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [nextProjectId, setNextProjectId] = useState(1);
  const [nextTaskId, setNextTaskId] = useState(1);
  const [modals, setModals] = useState({
    projectModal: false,
    taskModal: false
  });
  const [notification, setNotification] = useState(null);

  // Form states
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    priority: '',
    deadline: '',
    assignee: ''
  });

  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    projectId: '',
    priority: '',
    deadline: '',
    assignee: ''
  });

  // Load sample data on component mount
  useEffect(() => {
    const sampleProjects = [
      {
        id: 1,
        name: "Website Redesign",
        description: "Complete overhaul of company website",
        priority: "high",
        deadline: "2025-08-15",
        assignee: "John Doe",
        status: "progress",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Mobile App Development",
        description: "Develop iOS and Android mobile application",
        priority: "medium",
        deadline: "2025-09-30",
        assignee: "Jane Smith",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ];

    const sampleTasks = [
      {
        id: 1,
        name: "Design Homepage Layout",
        description: "Create wireframes and mockups for homepage",
        projectId: 1,
        priority: "high",
        deadline: "2025-07-20",
        assignee: "Alice Johnson",
        status: "progress",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Setup Development Environment",
        description: "Configure development tools and frameworks",
        projectId: 2,
        priority: "medium",
        deadline: "2025-07-25",
        assignee: "Bob Wilson",
        status: "completed",
        createdAt: new Date().toISOString()
      }
    ];

    setProjects(sampleProjects);
    setTasks(sampleTasks);
    setNextProjectId(3);
    setNextTaskId(3);
  }, []);

  // Modal functions
  const openModal = (modalId) => {
    setModals(prev => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId) => {
    setModals(prev => ({ ...prev, [modalId]: false }));
  };

  // Form handlers
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    
    const project = {
      id: nextProjectId,
      name: projectForm.name,
      description: projectForm.description,
      priority: projectForm.priority,
      deadline: projectForm.deadline,
      assignee: projectForm.assignee,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, project]);
    setNextProjectId(prev => prev + 1);
    closeModal('projectModal');
    setProjectForm({ name: '', description: '', priority: '', deadline: '', assignee: '' });
    showNotification('Project created successfully!');
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    
    const task = {
      id: nextTaskId,
      name: taskForm.name,
      description: taskForm.description,
      projectId: parseInt(taskForm.projectId),
      priority: taskForm.priority,
      deadline: taskForm.deadline,
      assignee: taskForm.assignee,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, task]);
    setNextTaskId(prev => prev + 1);
    closeModal('taskModal');
    setTaskForm({ name: '', description: '', projectId: '', priority: '', deadline: '', assignee: '' });
    showNotification('Task created successfully!');
  };

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate statistics
  const allItems = [...projects, ...tasks];
  const completed = allItems.filter(item => item.status === 'completed').length;
  const pending = allItems.filter(item => item.status === 'pending').length;

  // Priority and status classes
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-orange-500';
      case 'progress': return 'bg-blue-500';
      case 'completed': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-5">
        {/* Header */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-700 mb-3">Admin Workplan Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage projects and tasks efficiently with comprehensive oversight</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={() => openModal('projectModal')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
          >
            <span>➕</span> Create New Project
          </button>
          <button
            onClick={() => openModal('taskModal')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
          >
            <span>📋</span> Create New Task
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl p-5 text-center shadow-lg border border-gray-200">
            <div className="text-4xl font-bold text-indigo-500 mb-1">{projects.length}</div>
            <div className="text-gray-600 text-sm">Total Projects</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-lg border border-gray-200">
            <div className="text-4xl font-bold text-red-500 mb-1">{tasks.length}</div>
            <div className="text-gray-600 text-sm">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-lg border border-gray-200">
            <div className="text-4xl font-bold text-teal-500 mb-1">{completed}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-lg border border-gray-200">
            <div className="text-4xl font-bold text-orange-500 mb-1">{pending}</div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects List */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-5">📊 Recent Projects</h3>
            <div className="max-h-80 overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-center text-gray-500">No projects created yet</p>
              ) : (
                projects.slice(-5).reverse().map(project => (
                  <div
                    key={project.id}
                    className="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-indigo-500 hover:translate-x-1 hover:shadow-md transition-all duration-300"
                  >
                    <h4 className="font-semibold text-gray-800 mb-1">{project.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span>Due: {formatDate(project.deadline)}</span>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-white font-medium ${getPriorityClass(project.priority)}`}>
                          {project.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-white font-medium ${getStatusClass(project.status)}`}>
                          {project.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-5">📋 Recent Tasks</h3>
            <div className="max-h-80 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-500">No tasks created yet</p>
              ) : (
                tasks.slice(-5).reverse().map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  return (
                    <div
                      key={task.id}
                      className="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-indigo-500 hover:translate-x-1 hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-semibold text-gray-800 mb-1">{task.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                      <p className="text-sm mb-2"><strong>Project:</strong> {project ? project.name : 'N/A'}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span>Due: {formatDate(task.deadline)}</span>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-white font-medium ${getPriorityClass(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-white font-medium ${getStatusClass(task.status)}`}>
                            {task.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Project Modal */}
        {modals.projectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl p-8 w-full max-w-md max-h-screen overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => closeModal('projectModal')}
                className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold transition-all duration-300"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6 mt-2">Create New Project</h2>
              <div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Project Name</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors min-h-24 resize-y"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Priority</label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({...projectForm, priority: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Deadline</label>
                  <input
                    type="date"
                    value={projectForm.deadline}
                    onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Assignee</label>
                  <input
                    type="text"
                    value={projectForm.assignee}
                    onChange={(e) => setProjectForm({...projectForm, assignee: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <button
                  onClick={handleProjectSubmit}
                  className="w-full py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Modal */}
        {modals.taskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl p-8 w-full max-w-md max-h-screen overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => closeModal('taskModal')}
                className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold transition-all duration-300"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6 mt-2">Create New Task</h2>
              <form onSubmit={handleTaskSubmit}>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Task Name</label>
                  <input
                    type="text"
                    value={taskForm.name}
                    onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors min-h-24 resize-y"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Project</label>
                  <select
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({...taskForm, projectId: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Deadline</label>
                  <input
                    type="date"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({...taskForm, deadline: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700">Assignee</label>
                  <input
                    type="text"
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({...taskForm, assignee: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Create Task
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-4 rounded-lg shadow-lg z-50 animate-pulse">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkplan;