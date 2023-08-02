const express = require('express')
const User = require('./users/model')
const server = express()

server.use(express.json());

server.post('/api/users', async (req, res) => {
    const { name, bio } = req.body;

    if(!name || !bio) {
        return res.status(400).json({ message: "Please provide name and bio for the user."})
    }
    try {
        const newUser = await User.insert({ name, bio})
        return res.status(201).json(newUser)
    }
    catch {
        return res.status(500).json({ message: "There was an error while saving the user to the database"});
    }
});

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: 'error getting users',
            err: err.message,
            stack: err.stack,
        })
    })
})
server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if (!user) {
            res.status(404).json({
                message: "The user with the specified ID does not exist",
            })
        }
        res.json(user)
    })
    .catch(err => {
        res.status(500).json({
            message: 'error getting users',
            err: err.message,
            stack: err.stack,
        })
    })
})

server.delete('/api/users/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "The user with the specified ID does not exist"
            });
        }
        await User.remove(req.params.id);
        res.json(user);
    }
    catch (err) {
        res.status(500).json({
            message: 'Error removing the user',
            err: err.message,
            stack: err.stack,
        });
    }
})

server.put('/api/users/:id', async (req, res) => {
    const { name, bio } = req.body;
    const { id } = req.params;
    if (!name || !bio ) {
        return res.status(400).json({ message: "Please provide name and bio for the user"})
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "The user with the specified ID does not exist"
            });
        }
        const updatedUser = await User.update(id, {name, bio});
    res.json(updatedUser);
    }
    
    catch (err) {
        res.status(500).json({
            message: 'Error updating the user',
            err: err.message,
            stack: err.stack,
        })
    }
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'The route does not exist'
    })
})

module.exports = server; 