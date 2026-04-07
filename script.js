// Task Manager Module
const TaskManager = {
    // Array to store tasks
    tasks: [],
    
    // Initialize the app
    init() {
        this.cacheDOMElements();
        this.bindEvents();
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
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TaskManager.init();
});
