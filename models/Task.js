import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
{
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type:String,
        trim:true,
        required:true,
    },
    state:{
        type:Boolean,
        default:false,
    },
    deliveryDate :{
        type:String,
        trim: true,
        default: Date.now()
    },
    priority:{
        type:String,
        required:true,
        enum:["Low","Medium","High"],
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project',
    },
    completed:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
},{
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

