// import module express
import express from "express"
// import đối tượng router đã được code trong file calroute.js
import router from "../route/calroute.js";
// import module cors
// nhờ cors trình duyệt biết rằng nó được phép chia sẻ tài nguyên (API) với các nguồn gốc (origins) khác
import cors from "cors"

const app=express();
// cho phép frontend React (5173) gọi API
// app.use gắn middleware cors
app.use(cors({
// thuộc tính origin xác định nguồn gốc nào được phép truy cập API của bạn
// server chỉ chấp nhận các yêu cầu đến từ một frontend đang chạy tại địa chỉ http://localhost:5173
  origin: "http://localhost:5173",
// thuộc tính methods xác định phương thức HTTP nào được phép sử dụng khi truy cập API
// server chỉ cho phép các yêu cầu có phương thức POST đến từ localhost:5173
  methods: ["POST"],
}));
// cho phép Express đọc JSON body, nếu ko thì req.body=underfile
app.use(express.json());
// gắn route vào /api
// request thực tế là: POST http://localhost:8001/api
app.use("/api", router);
// khởi động server
// app.listen chấp nhận kết nối trên một cổng mạng cụ thể, là 8001
app.listen(8001, () =>{
  // nếu chạy thành công, thông báo ra console
  console.log(`Start in a port 8001`)
})