import express from 'express';
const router = express.Router();
import { registry, auth, confirm, resetPassword, matchToken, newPassword, profile} from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';
// authenticación, registry and confirmation for users

router.post("/", registry);
router.post("/login", auth);
router.get("/confirm/:token", confirm);
router.post("/reset_password", resetPassword);
router.route("/reset_password/:token")
    .get(matchToken)
    .post(newPassword);
router.get("/profile", checkAuth, profile);



export default router;  