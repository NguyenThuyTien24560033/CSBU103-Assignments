// import thư viện Express
import express from "express";
// import hàm connectDB dùng để kết nối với cơ sở dữ liệu MongoDB
import connectDB  from "./config/db.js";
// import thư viện giúp tải các biến môi trường từ file .env
import dotenv from "dotenv";
// tải các biến như MONGODB URI, API từ file .env vào process.env
dotenv.config();
// import hàm photoRoutes từ routes/photoRoutes.js
import photoRoutes from "./routes/photoRoutes.js";
// import module cors
// nhờ cors trình duyệt biết rằng nó được phép chia sẻ tài nguyên (API) với các nguồn gốc (origins) khác
import cors from 'cors';


const app = express();
// cho phép Express đọc JSON body, nếu ko thì req.body=underfile
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// cho phép frontend React (5173) gọi API
// app.use gắn middleware cors
app.use(cors({
// thuộc tính origin xác định nguồn gốc nào được phép truy cập API của bạn
// server chỉ chấp nhận các yêu cầu đến từ một frontend đang chạy tại địa chỉ http://localhost:5173
  origin: "http://localhost:5173",
// thuộc tính methods xác định phương thức HTTP nào được phép sử dụng khi truy cập API
// server chỉ cho phép các yêu cầu có phương thức POST, GET, DELETE đến từ localhost:5173
  methods: ["GET", "POST", "DELETE"],
}));
// gắn photoRoutes vào /api
app.use("/api", photoRoutes);


// khai báo 1 biến tên PORT chứa giá trị cổng
// process.env.PORT: lấy giá trị của biến môi trường PORT được định nghĩa trong file .env hoặc là 8000
const PORT = process.env.PORT || 8000
// connectDB() gọi hàm kết nối database
// .then chỉ thực hiện sau khi database kết nối thành công 
connectDB().then( () => {
  // lắng nghe các yêu cầu đến trên cổng
    app.listen(PORT, () => {
    // sau khi lắng nghe thành công thì log ra màn hình message
    console.log(`server starts in port ${PORT}`);
    });

});
