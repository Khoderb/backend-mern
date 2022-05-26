import Project from "../models/Project.js";
import Task from "../models/Task.js";



const addTask = async (req,res)=>{
    const { project } = req.body;
    const checkProject = await Project.findById(project).populate('tasks');
    
    if( !checkProject ){ 
        const error = new Error("Project not found");
        return res.status(404).json({msg:error.mesasge});
    }
    if( checkProject.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    } 
    try {
        const savedTask = await Task.create(req.body);
        //storage project id in task
        checkProject.tasks = [...checkProject.tasks, savedTask._id];
        await checkProject.save();
        res.status(200).json(savedTask);
    } catch (error) {
        return res.status(401).json({ msg: error.message });
    }
}


const getTask = async (req,res)=>{
    const { id } = req.params
    const task = await Task.findById(id).populate('project');
    if(!task ) { 
        const error = new Error("Task not found");
        return res.status(404).json({msg:error.message});
    }
    if( task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(403).json({ msg: error.message });
    }
    res.status(200).json(task);
}


const updateTask = async (req,res)=>{
    const { id } = req.params
    const task = await Task.findById(id).populate('project');
    
    if(!task ) { 
        const error = new Error("Task not found");
        return res.status(404).json({msg:error.message});
    }
    if( task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(403).json({ msg: error.message });
    }
    try {
        task.name = req.body.name || task.name;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.deliveryDate = req.body.deliveryDate || task.deliveryDate;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
            console.log(error)
    }
}


const deleteTask = async (req,res)=>{
    const { id } = req.params
    const task = await Task.findById(id).populate('project');
    
    if(!task ) { 
        const error = new Error("Task not found");
        return res.status(404).json({msg:error.message});
    }
    if( task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(403).json({msg: error.message });
    }
    try  {
        const project = await Project.findById(task.project);
        project.tasks.pull(task._id);
        await Promise.allSettled([await task.save(), await task.deleteOne()])
        res.status(200).json({msg:"Task deleted successfully"});
    } catch (error) {
        console.log(error);                
    }
}


const changeState = async (req,res ) =>{
    const { id } = req.params

    const task = await Task.findById(id)
        .populate('project')
    
    if(!task ) { 
        const error = new Error("Task not found");
        return res.status(404).json({msg:error.message});
    }
    if( 
        task.project.creator.toString() !== req.user._id.toString() && 
        !task.project.contributors.some( contributor => contributor._id.toString() === req.user._id.toString())
    ){
        
        const error = new Error('Unauthorized');
        return res.status(403).json({msg: error.message });
    }
    
    task.state=!task.state;
    task.completed = req.user._id;
    await task.save();

    const savedTask = await Task.findById(id).populate('completed');
    await savedTask.save();

    res.status(200).json(savedTask);
}

export { 
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
}