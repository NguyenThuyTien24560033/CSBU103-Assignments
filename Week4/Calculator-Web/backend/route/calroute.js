// Ở đây thiết lập routing, tạo POST(gửi)/api
// import module express
import express from "express";
// import hàm xử lý calculate đã được code trong file calcontroller.js
import { calculate } from "../controllers/calcontroller.js";
// express.Router() là một lớp tích hợp của Express.js cho phép bạn tạo ra các bộ định tuyến mini 
// khởi tạo 1 bộ định tuyến mini tên router
const router = express.Router();
// server nhận được yêu cầu POST tại đường dẫn /
// express sẽ ngay lập tức chuyển quyền xử lý sang hàm calculate
router.post("/", calculate);
// export default đối tượng router
export default router;