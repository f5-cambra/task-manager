// Task Manager Module
const TaskManager = {
    // Array to store tasks
    tasks: [],
    
    // localStorage key
    STORAGE_KEY: 'taskManager_tasks',
    
    // Initialize the app
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.loadTasks();
        this.render();
    },
    
    // Cache DOM elements for better performance
    cacheDOMElements() {
        this.form = document.getElementById('taskForm');
        this.input = document.getElementById('taskDescription');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.tasksSection = document.getElementById('tasksSection');
    },
    
    // Bind event listeners
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.taskList.addEventListener('change', (e) => this.handleCheckboxChange(e));
    },
    
    // Load tasks from localStorage
    loadTasks() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.tasks = JSON.parse(stored);
                // Convert date strings back to Date objects
                this.tasks.forEach(task => {
                    task.createdAt = new Date(task.createdAt);
                });
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.tasks = [];
        }
    },
    
    // Save tasks to localStorage
    saveTasks() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
            // Could show a user-friendly error message here
        }
    },
    
    // Handle form submission
    handleSubmit(event) {
        event.preventDefault();
        
        const taskText = this.input.value.trim();
        
        if (taskText === '') {
            return;
        }
        
        this.addTask(taskText);
        this.clearInput();
    },
    
    // Add a new task
    addTask(text) {
        const task = {
            id: Date.now(), // Simple ID generation
            text: text,
            completed: false,
            createdAt: new Date()
        };
        
        this.tasks.unshift(task); // Add to beginning of array
        this.saveTasks(); // Save to localStorage
        this.render();
    },
    
    // Handle checkbox change
    handleCheckboxChange(event) {
        if (event.target.classList.contains('task-checkbox')) {
            const taskId = parseInt(event.target.dataset.taskId);
            this.toggleTask(taskId);
        }
    },
    
    // Toggle task completion
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks(); // Save to localStorage
            this.render();
        }
    },
    
    // Clear input field
    clearInput() {
        this.input.value = '';
        this.input.focus();
    },
    
    // Render tasks to DOM
    render() {
        // Show/hide empty state
        if (this.tasks.length === 0) {
            this.emptyState.hidden = false;
            this.taskList.innerHTML = '';
            return;
        }
        
        this.emptyState.hidden = true;
        
        // Generate HTML for tasks
        const tasksHTML = this.tasks.map(task => this.createTaskHTML(task)).join('');
        this.taskList.innerHTML = tasksHTML;
    },
    
    // Create HTML for a single task
    createTaskHTML(task) {
        const checkedAttr = task.completed ? 'checked' : '';
        const completedClass = task.completed ? 'task-label--completed' : '';
        
        return `
            <li class="task-item">
                <input 
                    type="checkbox" 
                    id="task-${task.id}" 
                    class="task-checkbox"
                    data-task-id="${task.id}"
                    ${checkedAttr}
                >
                <label for="task-${task.id}" class="task-label ${completedClass}">
                    ${this.escapeHTML(task.text)}
                </label>
            </li>
        `;
    },
    
    // Escape HTML to prevent XSS
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Clear all tasks (utility method for future use)
    clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    },
    
    // Export tasks (utility method for future use)
    exportTasks() {
        return JSON.stringify(this.tasks, null, 2);
    },
    
    // Import tasks (utility method for future use)
    importTasks(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (Array.isArray(imported)) {
                this.tasks = imported;
                this.saveTasks();
                this.render();
                return true;
            }
        } catch (error) {
            console.error('Error importing tasks:', error);
        }
        return false;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TaskManager.init();
    
    // Optional: Show storage info in console
    console.log(`Task Manager initialized. ${TaskManager.tasks.length} task(s) loaded from localStorage.`);
});

// Optional: Handle storage events (if user has multiple tabs open)
window.addEventListener('storage', (e) => {
    if (e.key === TaskManager.STORAGE_KEY) {
        TaskManager.loadTasks();
        TaskManager.render();
        console.log('Tasks updated from another tab');
    }
});
