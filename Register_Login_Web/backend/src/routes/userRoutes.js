import express from "express";
import { registerUser, loginUser, updateUser } from "../controllers/userControllers.js";
import { changePassword } from "../controllers/userControllers.js";
const router = express.Router();

// Đăng ký tài khoản
router.post("/register", registerUser);

// Đăng nhập
router.post("/login", loginUser);

// đổi mật khẩu
router.put("/:id/change", changePassword);
// update thông tin
router.put("/:id", updateUser);



export default router;
