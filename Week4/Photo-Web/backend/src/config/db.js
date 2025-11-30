// import thư viện mongoose, dùng để kết nối và làm việc với MongoDB trong Node.js
import mongoose from 'mongoose';
// khai báo 1 biến tên connectDB, dùng hàm bất đồng bộ async, và hàm callback là hàm mũi tên
const connectDB = async () => {
  // try..catch để bắt lỗi
  try {
    // await chờ cho đến khi kết nối database thành công
    // dùng phương thức mongoose.connect để kết nối chương trình đến MONGODB
    // process.env.MONGODB đây là biến môi trường chứa URI
    await mongoose.connect(process.env.MONGODB);
    // sau khi kết nối thành công thì log ra thông báo
    console.log("Liên kết database thành công!");
    // nếu có lỗi thì bắt(catch) và thực hiện console thông báo lỗi 
  } catch (error) {
    console.error("Lỗi khi kết nối database", error);
    // bị lỗi thì dùng process.exit(1); để dừng hẳn chương trình tránh việc server chạy mà ko có database
    process.exit(1);
  }
};
// export mặc định đối tượng connectDB
export default connectDB;
