import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        trim: true,
        required: true
    },
    deliveryDate:{
        type: String,
        trim: true,
        default: Date.now(),
    },
    client:{
        type: String,
        trim: true,
        required: true,
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    //arreglo de usuarios
    contributors:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    //arreglo de tareas
    tasks:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
},
    {
        timestamps: true
    }
);
const Project = mongoose.model("Project", projectSchema);

export default Project;