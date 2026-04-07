// Import required modules
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Port configuration
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// In-memory storage for now (we'll replace this with a database later)
let tasks = [];

// Basic route to test server
app.get('/', (req, res) => {
    res.json({ 
        message: 'Task Manager API', 
        version: '1.0.0',
        endpoints: {
            'GET /api/tasks': 'Get all tasks',
            'POST /api/tasks': 'Create a new task'
        }
    });
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

// POST create a new task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;
    
    // Validation
    if (!text || text.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Task text is required'
        });
    }
    
    // Create new task
    const newTask = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to tasks array (at the beginning)
    tasks.unshift(newTask);
    
    // Send response
    res.status(201).json({
        success: true,
        data: newTask
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/tasks`);
});
