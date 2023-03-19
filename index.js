const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

//Connect to DB
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

//Define Schema for collection "todos" and create model
const todoSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
});
  
const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/todos', async (req, res) => {
    const todos = await Todo.find().sort('-_id');
    res.send(todos);
});

// Add a new todo
app.post('/todos', async (req, res) => {
    let todo = new Todo({
        title: req.body.title,
        description: req.body.description
    });
    todo = await todo.save();
    res.send(todo);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
    }, { new: true });
    if (!todo) return res.status(404).send('The todo with the given ID was not found.');
    res.send(todo);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndRemove(req.params.id);
    if (!todo) return res.status(404).send('The todo with the given ID was not found.');
    res.send(todo);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
