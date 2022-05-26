import Project from "../models/Project.js"
import Task from "../models/Task.js";
import User from "../models/User.js";



const newProject = async (req,res) => {
    const project = new Project(req.body);
    project.creator = req.user._id;
    try {
        const savedProject = await project.save();
        res.json(savedProject);        
    } catch (error) {
        console.log(error);
    }
}
const getProjects = async (req, res) => {
    const projects = await Project.find({
        $or:[
            { contributors:{ $in: req.user } },
            { creator : {$in: req.user } }
        ]
    }).select("-tasks");
    res.json(projects);
}

const getOneProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id)
        .populate({
            path:'tasks',
            populate :{path: "completed", select :"name"}
        })
        .populate('contributors','name email');
    
    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }
    
    if( project.creator.toString() !== req.user._id.toString() && 
        !project.contributors.some(contrib=>contrib._id.toString()===req.user._id.toString())){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    } 
    //get tasks asociated to the project
    const task = await Task.find().where("project").equals(project._id);
    res.json(project);
}

const updateOneProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ message: error.message });
    }
    
    if( project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ message: error.message });
    } 
    
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
    project.client = req.body.client || project.client;

    try {
        const projectUpdated  = await project.save();
        return res.json(projectUpdated);
    } catch (error) {
        console.log(error)
    }
}   

const deleteOneProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }
    
    if( project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    } 
    try {
        await project.deleteOne(); //.romeve() works too
        return res.status(200).json({ msg: "Project deleted" });
    } catch (error) {     
        console.log(error);
    }
}

const findContributor = async (req,res) => {
    const {email} = req.body;
    const user = await User.findOne({email}).select("-password -createdAt -confirmed -token -updatedAt -__v");
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({ msg: error.message });
    }
    res.json(user);
}

const addContributor = async (req, res) => {
    const project = await Project.findById(req.params.id);
    
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }
    
    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    
    const {email} = req.body;
    const user = await User.findOne({email}).select("-password -createdAt -confirmed -token -updatedAt -__v");
    
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString()=== user._id.toString()){
        const error = new Error("Creator can't be a contributor");
        return res.status(403).json({ msg: error.message });
    }

    if(project.contributors.includes(user._id)){
        const error = new Error("Contributor is already in project")
        return res.status(403).json({msg: error.message});
    }
    //Validation pass
    project.contributors.push(user._id);
    await project.save();
    return res.json({msg:"contributor added success"});
}

const deleteContributor = async (req, res) => {
    const project = await Project.findById(req.params.id);
    
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }
    
    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    //else can be deleted
    project.contributors.pull(req.body.id)
    await project.save()
    res.json({ msg: 'Contributor deleted succesfully'})    
}


export {
    getProjects, 
    newProject,
    getOneProject,
    updateOneProject,
    deleteOneProject,
    addContributor,
    deleteContributor,
    findContributor
}