// import thư viện multer, dùng để upload file trong Express
import multer from "multer";
// khởi tạo cấu hình lưu file 
// khai báo 1 biến tên storage
// multer.diskStorage({...}) là 1 hàm tạo bộ nhớ dạng lưu trữ vào ổ đĩa (tức là lưu file vào máy server)
const storage = multer.diskStorage({
  //  destination: xác định thư mục mà file tải lên sẽ được lưu trên máy chủ
  destination: (req, file, cb) => {
    // req: request từ client
    // file: thông tin file đang upload
    // cb là callback, null là ko có lỗi thì lưu vào thư mực "uploads/"
    cb(null, "uploads/"); 
  },
  // filename: cách đặt tên file khi lưu
  filename: (req, file, cb) => {
    // khai báo 1 biến tên uniqueName chứa tên file ảnh, tên riêng biệt tránh việc 2 ảnh có chung tên
    // Date.now(): trả về số mili s, cơ bản là 1 giá trị duy nhất tại thời gian là duy nhất
    // file.originalname: tên gốc
    // format: thời gian hiện tại bằng mili giây - tên gốc
    const uniqueName = Date.now() + "-" + file.originalname;
    // cb là callback, null là ko có lỗi thì truyền tên file mới đã tạo
    cb(null, uniqueName);
  },
});
// tạo middleware upload file
const upload = multer({ storage });
// export mặc định đối tượng upload
export default upload;
