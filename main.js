// App state
let tasks = [
    {
        id: 1,
        title: "Complete project documentation",
        description: "Write comprehensive documentation for the new project",
        priority: "high",
        dueDate: "2024-12-30",
        completed: false,
        createdAt: new Date()
    },
    {
        id: 2,
        title: "Review code changes",
        description: "Review pull requests from team members",
        priority: "medium",
        dueDate: "2024-12-28",
        completed: true,
        createdAt: new Date(Date.now() - 86400000)
    }
];

let currentFilter = 'all';

// DOM elements
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Add task function
function addTask(taskData) {
    const newTask = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(newTask);
    renderTasks();
    updateStats();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
    }
}

// Render tasks
function renderTasks() {
    let filteredTasks = tasks;

    // Apply filter
    switch (currentFilter) {
        case 'pending':
            filteredTasks = tasks.filter(t => !t.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(t => t.completed);
            break;
        case 'high':
            filteredTasks = tasks.filter(t => t.priority === 'high');
            break;
    }

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found!</h3>
                <p>Try changing the filter or add a new task.</p>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <span class="task-priority priority-${task.priority}">
                    ${task.priority.toUpperCase()}
                </span>
            </div>
            
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            
            <div class="task-meta">
                <div>
                    ${task.dueDate ? `<span class="task-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn btn-success" onclick="toggleTask(${task.id})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value
    };

    addTask(formData);
    taskForm.reset();
});

// Filter buttons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update filter
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Initialize app
function init() {
    renderTasks();
    updateStats();

    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
}

// Load app when page loads
document.addEventListener('DOMContentLoaded', init);

// Footer functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function clearAllTasks() {
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
        tasks = [];
        renderTasks();
        updateStats();
    }
}

function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'my-tasks.json';
    link.click();
}