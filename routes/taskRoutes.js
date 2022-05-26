import express from 'express';
import { addTask, deleteTask, updateTask , getTask, changeState } from '../controllers/taskController.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

router.post('/',checkAuth, addTask)
router.route("/:id")
    .get(checkAuth, getTask)
    .put(checkAuth, updateTask)
    .delete(checkAuth, deleteTask)
router.post("/state/:id",checkAuth,changeState)















export default router;  
