import {
    getProjects,
    newProject,
    getOneProject,
    updateOneProject,
    deleteOneProject,
    findContributor,
    addContributor,
    deleteContributor,
}
from '../controllers/projectController.js';
import checkAuth from '../middleware/checkAuth.js';
import express from 'express';

const router = express.Router();

router.route('/')
    .post(checkAuth,newProject)
    .get(checkAuth, getProjects);

router.route('/:id')
    .get(checkAuth, getOneProject)
    .delete(checkAuth, deleteOneProject)
    .put(checkAuth, updateOneProject);

router.post("/contributors", checkAuth, findContributor);
router.post("/contributors/:id", checkAuth, addContributor);
router.post("/delete-contributor/:id", checkAuth, deleteContributor);


export default router;




