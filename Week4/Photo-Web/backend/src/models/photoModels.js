// import thư viện mongoose, dùng để kết nối và làm việc với MongoDB trong Node.js
import mongoose from "mongoose";
// khai báo 1 biến tên là photoSchema chứa đối tượng schema đã được cấu hình
// new mongoose.Schema khởi tạo một khuôn mẫu
const photoSchema = new mongoose.Schema(
  {
    // cấu hình cho trường coverImage bên trong photoSchema của Mongoose
    coverImage: {
      // bắt buộc
      required: true,
      // kiểu dữ liệu là chuỗi kí tự, ở đây là url ảnh 
      type: String, 
    },
  },
  {
    // MongoDB tự thêm createdAt, updatedAt chỉ thời gian lúc create tài liệu
    timestamps: true, 
  }
);

// điểm kết nối giữa cấu trúc dữ liệu bạn đã định nghĩa (Schema) và cơ sở dữ liệu MongoDB
// khai báo 1 biến tên Photo nơi chứa Model
//  mongoose.model biên dịch Schema thành 1 Model 
// ("Photo", photoSchema) tên Model, tên Schema
const Photo = mongoose.model("Photo", photoSchema);
// export mặc định đối tượng Photo
export default Photo;
