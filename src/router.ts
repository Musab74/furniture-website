import express from "express";
import memberController from "./controllers/member.contoller";

const router = express.Router();
 
router.post("/login", memberController.Login);
router.post("/SignUp", memberController.SignUp)

export default router;