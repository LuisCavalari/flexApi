const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Project = require('../model/Projects');
const Task = require('../model/Tasks')
const router = express.Router();

router.use(authMiddleware)

router.get('/', async (request, response) => {
    try {
        const listProjects = await Project.find()
            .populate('user')
            .populate('tasks');

        return response.send({ listProjects });
    } catch (error) {
        return response.status(400).send({ error: 'Error listing projects' })
    }

});

router.get('/:projectId', async (request, response) => {
    try {
        const { projectId: id } = request.params
        const project = await Project.findById(id)
            .populate('user')

        return response.send({ project });
    } catch (error) {
        console.log(error)
        return response.status(400).send({ error: 'Error listing project' })
    }
})

router.post('/', async (request, response) => {
    try {
        const { title, description, tasks } = request.body;
        const { userId: user } = request;

        const newProject = await Project.create({ title, description, user })

        await Promise.all(tasks.map(async (task) => {
            const newTask = new Task({
                ...task,
                project: newProject._id
            })
            await newTask.save()
            newProject.tasks.push(newTask)
        }))

        await newProject.save()

        return response.send({ newProject })

    } catch (error) {
        console.log(error)
        return response.status(400).send({ error: 'Error creating new project' })

    }

});

router.put('/:projectId', async (request, response) => {
    try {
        const { title, description, tasks } = request.body;
        const { projectId } = request.params

        const newProject = await Project.findByIdAndUpdate(projectId,
            {
                title,
                description,
            }, { new:true })

        newProject.task = []
        await Task.remove({ project: newProject._id })

        await Promise.all(tasks.map(async (task) => {
            const newTask = new Task({
                ...task,
                project: newProject._id
            })
            await newTask.save()
            newProject.tasks.push(newTask)
        }))

        await newProject.save()

        return response.send({ newProject })

    } catch (error) {
        console.log(error)
        return response.status(400).send({ error: 'Error updating  project' })

    }

});

router.delete('/:projectId', async (request, response) => {
    try {
        const { projectId } = request.params;

        await Project.findByIdAndDelete(projectId)

        return response.send({ ok: true })

    } catch (error) {
        return response.status(400).send({ error: 'Error deleting  project' })
    }

});





module.exports = server => server.use('/project', router);
