// const express = require('express'); luego de cambiar type: 'commonjs' por type 'module'
import express from 'express' //1°
import dotenv from 'dotenv' //2°
import cors from 'cors' //3°
import conectarDB  from './config/db.js'; //3°
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'


const app = express(); //1°
app.use(express.json()); // habilitar recibir y leer JSON, 5°

dotenv.config(); //2°

conectarDB(); //3°

//cors config
const whiteList = [process.env.FRONTEND_URL, "https://spontaneous-meringue-e8cd88.netlify.app/"];
const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.indexOf(origin) !== -1 || !origin ){
            callback(null,true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
}

app.use(cors(corsOptions));


//Router
app.use("/api/users", userRoutes); //4°
app.use("/api/projects", projectRoutes); //4°
app.use("/api/task", taskRoutes); //4°


const PORT = process.env.PORT || 3800; 

const server = app.listen(PORT, () => {
     console.log(`MERN app listening on port ${PORT}!`);
    });

//socket.io
import { Server } from "socket.io"

const io = new Server(server,{
    pingTimeout: 60000,
    pingInterval: 25000,
    cors:{
        origin: process.env.FRONTEND_URL,
    },
})

io.on("connection", (socket)=> {
    console.log("connected to socket.io")
    //Events socket io
    socket.on("open project", (projectId)=>{
        socket.join(projectId);
    });


    socket.on("add task" ,(task) =>{       
        socket.to(task.project).emit("task added", task);
    });

    socket.on("delete task", (task)=>{
        socket.to(task.project).emit("task deleted", task);
    })

    socket.on("update task", (task) =>{
        const project = task.project._id;
        socket.to(project).emit("updated task", task);
    });

    socket.on("complete task", (task) => {
        const project = task.project
        console.log(task.project)
        socket.to(project).emit("completed task", task)
    })

});