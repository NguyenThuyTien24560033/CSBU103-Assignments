// import photoModels có tên Photo từ đường dẫn, Model này là cầu nối để thực hiện các thao tác trên collection photos trong MongoDB
import Photo from "../models/photoModels.js";


// lấy toàn bộ ảnh
// khai báo hàm bất đồng bộ và export hàm getAllPhotos xử lý request
export const getAllPhotos = async (req, res) => {
  try {
    //phương thức find() của photoModels để truy vấn và lấy tất cả sách trong collection.
    const photos = await Photo.find();
    // Gửi mã trạng thái 200 (nghĩa là thành công) và trả về danh sách sách dưới dạng JSON cho client.
    res.status(200).json(photos);
  } catch (error) {
    // Nếu có lỗi, gửi mã trạng thái 500 kèm thông báo lỗi chi tiết.
    res.status(500).json({ message: "Error when take a list of photos", error });
  }
};


// lấy 1 ảnh theo id, export hàm getPhotoById xử lý request
export const getPhotoById = async (req, res) => {
  try {
    //findById() để tìm một sách dựa trên ID được truyền vào từ tham số đường dẫn (req.params.id)
    const photo = await Photo.findById(req.params.id);
    // Nếu không tìm thấy sách, gửi mã trạng thái 404 (Not Found) và dừng hàm
    if (!photo) return res.status(404).json({ message: "photo not found" });
    // phản hồi trạng thái thành công là 200 dưới dạng 1 chuỗi json
    res.status(200).json(photo);
  // nếu có lỗi thì bắt lỗi và gửi mã trạng thái 500 và thông báo lỗi
  } catch (error) {
    res.status(500).json({ message: "Error when take a photo", error });
  }
};

// tạo ảnh mới, export hàm createPhoto xử lý request
export const createPhoto = async (req, res) => {
  try {
    // khởi tại biến tên coverImage có giá trị ban đầulà null
    let coverImage = null;

    // cho phép tạo ảnh bằng url trên internet
    // req.body.coverImage kiểm tra xem biến coverImage có tồn tại trong dữ liệu gửi lên ko, tránh underfile và null
    // req.body.coverImage.trim() !== "" tránh việc chuỗi gửi lên là chuỗi toàn khoảng trắng
    if (req.body.coverImage && req.body.coverImage.trim() !== "") {
      // nếu điều kiện đúng, thực hiện việc gán url ảnh trong dữ liệu gửi lên vào biến coverImage
      coverImage = req.body.coverImage;
    }

    // tải ảnh lên từ server
    // điều kiện là file ảnh đã được tải lên nhờ middleware multer thành công chưa
    if (req.file) {
      // nếu điều kiện đúng, 
      // req.protocol giao thức dữ liệu hiện tại, http/ htpps
      // req.get("host")} tên miền và cổng, localhost:8000
      // req.file.filename tên file duy nhất do multer tạo ra
      // coverImage sẽ chứa một url hoàn chỉnh
      coverImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // nếu coverImage đã có giá trị thì bỏ qua, nếu ko thì thực hiện if
    if (!coverImage) {
      // trả về 1 trạng thái 400 kèm message
      return res.status(400).json({ message: "No image provided" });
    }
    // khai báo 1 biến tên saved lưu trữ đối tượng Mongoose đã được lưu
    // chờ cho đến khi phương thức Photo.create tạo vào lưu một document mới trong collection Photos trong MongoDB 
    const saved = await Photo.create({ coverImage });
    // gửi phản hồi thành công và đối tượng saved dưới dạng json về client
    res.status(201).json(saved);
    // nếu xảy ra lỗi bắt lấy lỗi, trả về trạng thái 400 kèm một thông báo lỗi
  } catch (err) {
    res.status(400).json({ message: "Cannot create photo", err });
  }
};


// xóa ảnh, export hàm deletePhoto xử lý request
export const deletePhoto = async (req, res) => {
  try {
    // chờ phương thức Photo.findByIdAndDelete tìm kiếm một tài liệu trong collection Photo dựa trên trường _id và ngay lập tức xóa tài liệu đó khỏi database
    // khai báo 1 biến tên deletedPhoto chứa tài liệu bị tìm và xóa
    const deletedPhoto = await Photo.findByIdAndDelete(req.params.id);
    // nếu không tìm thấy tài liệu thì trả về mã trạng thái 404 và thông báo
    if (!deletedPhoto)
      return res.status(404).json({ message: "Don't find a photo" });
    // nếu tài liệu tồn tại thì trả về trạng thái 200 và thông báo dạng json 
    res.status(200).json({ message: "Delete a photo successful!" });
    // nếu xảy ra lỗi bắt lấy lỗi, trả về trạng thái 400 kèm một thông báo lỗi
  } catch (error) {
    console.error("Error when call deletePhoto", error);
    res.status(400).json({ message: "Deleting a photo is failed", error });
  }
};
// export mặc định các đối tượng getAllPhotos,getPhotoById,createPhoto,deletePhoto
export default {
  getAllPhotos,
  getPhotoById,
  createPhoto,
  deletePhoto,
};
