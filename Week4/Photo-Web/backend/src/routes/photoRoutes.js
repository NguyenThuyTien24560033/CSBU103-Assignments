// import thư viện Express để sử dụng tính năng tạo Router
import express from "express";
// import các controllers getAllPhotos, getPhotoById, createPhoto, deletePhoto từ file /controllers/photoControllers.js"
import {
  getAllPhotos,
  getPhotoById,
  createPhoto,
  deletePhoto,
} from "../controllers/photoControllers.js";
// import middleware multer đã cấu hình
import upload from "../../middleware/upload.js"; 
// khởi tạo router
const router = express.Router();
// các router gọi controller tương ứng
// khi client gửi yêu cầu GET /api hàm getAllPhotos sẽ được thực thi
router.get("/", getAllPhotos);
// khi client gửi yêu cầu GET /api/:id hàm getPhotoById sẽ được thực thi
router.get("/:id", getPhotoById);
// khi client gửi yêu cầu POST /api hàm createPhoto sẽ được thực thi
// upload.single("coverImage") một Middleware được chèn vào để chặn yêu cầu POST, xử lý file ảnh tải lên bằng cách lưu nó vào ổ đĩa server
router.post("/", upload.single("coverImage"), createPhoto);
// khi client gửi yêu cầu DELETE /api/:id hàm deletePhoto sẽ được thực thi
router.delete("/:id", deletePhoto);
// export mặc định đối tượng router
export default router;
