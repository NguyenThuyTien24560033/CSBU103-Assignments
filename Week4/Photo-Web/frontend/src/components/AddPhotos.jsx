// import thư viện từ react-router-dom
// useState là hook giúp tạo biến state — mỗi khi thay đổi, UI tự update
import { useState } from "react";
// useNavigate thực hiện việc chuyển hướng chương trình
import { useNavigate } from "react-router-dom";
// import thư viện axios
// axios thực hiện các yêu cầu http (gửi request và nhận response) từ các API hoặc server
import axios from "axios";
// import file css
import "./AddPhotos.css";
// khai báo hàm tên AddPhoto 
const AddPhoto = () => {
  // khởi tạo biến tên navigate, lưu trữ giá trị trả về của userNavigate
  const navigate = useNavigate();
  // khai báo state
  //photo là tên biến state hiện tại, chứa các giá trị lần lượt là nếu là file thì là null còn nếu là url thì là rỗng
  // setPhoto là tên hàm cập nhật state, dùng để thay đổi giá trị của tên biến state hiện tại tương ứng
  const [photo, setPhoto] = useState({
    file: null,
    url: ""
  });
  //previewUrl là tên biến state hiện tại, chứa là rỗng
  // setPreviewUrl là tên hàm cập nhật state, dùng để thay đổi giá trị của tên biến state hiện tại tương ứng
  const [previewUrl, setPreviewUrl] = useState("");

  // khai báo biến tên handleFileChange, xử lí khi users chọn tải file
  // e là đối tượng sự kiện, có thể thay đổi trong trường input
  const handleFileChange = (e) => {
    // khai báo biến tên file sẽ chứa đối tượng File
    // e.target là trường input
    // files[0] vào filelist lấy file đầu tiên
    const file = e.target.files[0];
    // kiểm tra xem file có tồn tại hay không, nếu ko thì thực hiện return
    if (!file) return;
    // cập nhật trạng thái state
    // ghi đè thuộc tính file trong state bằng đối tượng File mới mà users vừa chọn
    // đặt thuộc tính url về chuỗi rỗng
    setPhoto({ ...photo, file, url: "" }); // xoá URL nếu chọn file

    // khai báo biến tên preview chứa một URL tạm thời để trình duyệt có thể hiển thị xem trước
    const preview = URL.createObjectURL(file);
    // cập nhật state giá trị của preview
    setPreviewUrl(preview);
  };

   // khai báo biến tên handleUrlChange, xử lí khi users chọn tải bằng url
  // e là đối tượng sự kiện, có thể thay đổi trong trường input
  const handleUrlChange = (e) => {
    // cập nhật trạng thái state
    // e.target.value ghi đè thuộc tính url bằng giá trị hiện tại nhập vào trường input
    // đặt thuộc tính file về null
    setPhoto({ ...photo, url: e.target.value, file: null });
    // không dùng preview file
    setPreviewUrl(""); 
  };


  // khai báo hàm tên handleSave dùng xử lí chức năng lưu ảnh
  const handleSave = async () => {
    try {
      // kiểm tra trường file trong trạng thái photo có chứa đối tượng File hay ko
      if (photo.file) {
        // nếu có, khai báo 1 biến tên formData
        // new FormData xây dựng dữ liệu form mới để gửi qua http
        const formData = new FormData();
        // thêm file ảnh vào form data, với tên trường là "coverImage"
        formData.append("coverImage", photo.file);
        // await tạm dừng thực thi cho đến khi server phản hồi
        // gửi yêu cầu POST lên API backend bằng thư viện axios, tải lên dữ liệu form chứa file ảnh
        // http://localhost:8000/api URL endpoint đích
        // formData dữ liệu (payload) được gửi đi
        await axios.post("http://localhost:8000/api", formData, {
          // định dạng multipart/form-data
          headers: { "Content-Type": "multipart/form-data" },
        });
        // xử lý form ở chế độ nhập url trực tiếp
        // loại bỏ khoảng trắng ở hai đầu bằng .trim()
        // kiểm tra xem trường url trong trạng thái photo có chứa một chuỗi ký tự hợp lệ hay ko
      } else if (photo.url.trim() !== "") {
        // gửi request
        await axios.post("http://localhost:8000/api", {
          // dữ liệu gửi đi (payload)
          coverImage: photo.url,
        });
        // nếu kiểm tra ko tìm thấy sự tồn tại hay hợp của cả file hoặc url, sẽ hiện popup và return
      } else {
        alert("Please select a file or enter a URL");
        return;
      }

      // hiện popup thông báo add thành công và chuyển hướng về đường dẫn gốc /
      alert("Photo added successfully!");
      navigate("/");

      // khi có lỗi thì bắt lấy, console một message lỗi và hiện popup thông báo cho users 
    } catch (err) {
      console.error("Error when adding photo:", err);
      alert("Could not add photo!");
    }
  };


  return (
    <div className="add-container">
      <div className="add-photo-container">
      {/* têu đề */}
        <h2>Add new photo.</h2>

        <div className="add-photo-form">
          
          {/* File Upload */}
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {/* URL Input */}
          <input
            type="text"
            placeholder="Enter image URL"
            value={photo.url}
            onChange={handleUrlChange}
          />

          {/* Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "200px", marginTop: "10px", borderRadius: "8px" }}
            />
          )}

          <div className="form-buttons">
          {/* tạo một nút bấm Save, khi nhấn vào hàm handleSave sẽ được kích hoạt */}
            <button className="btn-save" onClick={handleSave}>Save</button>
            {/* tạo một nút bấm Cancel, khi nhấn vào sẽ chuyển hướng về đường dẫn gốc / */}
            <button className="btn-cancel" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
// export mặc định AddPhoto
export default AddPhoto;
