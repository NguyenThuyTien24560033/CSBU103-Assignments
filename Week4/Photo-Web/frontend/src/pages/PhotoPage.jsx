// import thư viện từ react
// useState là hook giúp tạo biến state — mỗi khi thay đổi, UI tự update
// useState thực hiện các tác vụ bên ngoài luồng render của React, như gọi API để lấy dữ liệu, thao tác thủ công với DOM, hoặc thiết lập các bộ lắng nghe sự kiện
import { useEffect, useState } from "react";
import PhotoDetail from "../components/PhotoDetail.jsx"; // import child
// import file css
import "./PhotoPage.css";
// khai báo hàm tên PhotoPage, hàm này chứa toàn bộ logic + UI
const PhotoPage = () => {
  // khai báo state
  // photos, selectedPhoto là tên biến state hiện tại, chứa các giá trị lần lượt là mảng rỗng, null
  // setPhotos, setSelectedPhoto là tên hàm cập nhật state, dùng để thay đổi giá trị của tên biến state hiện tại tương ứng
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null); 

  // gọi API để tải dữ liệu ảnh từ endpoint /api của server backend
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // khai báo biến tên res chứa dữ liệu phản hồi từ fetch
        const res = await fetch("http://localhost:8000/api");
        // khai báo biến tên data chứa dữ liệu res dạng json nhưng giờ là dạng JS
        const data = await res.json();
        // cập nhật state
        setPhotos(data);
        // nếu có lỗi thì bắt lỗi rồi hiện thông báo lỗi
      } catch (err) {
        console.error(err);
      }
    };
    // gọi hàm thực thi
    fetchPhotos();
    // [] tải danh sách ảnh ban đầu từ server một lần duy nhất khi trang được mở
  }, []);

  return (
    <div>
      <div className="photo-list">
        <div className="photo-grid-list">
        {/* lặp qua mảng photos */}
          {photos.map(photo => (
            <div
              key={photo._id}
              className="photo-card"
              // nhấp chuột vào thẻ ảnh, nó gọi hàm setSelectedPhoto cập nhật state mở Modal
              onClick={() => setSelectedPhoto(photo)}
            >
            {/*hiển thị hình ảnh*/}
          <img
            className="photos-cover"
            // nguồn ảnh
            src={photo.coverImage}
          />
          </div>
        ))}
      </div>
    </div>


      {/* Render modal khi có photo được chọn */}
      {/* selectedPhoto là null thì <PhotoDetail /> sẽ không được render */}
      {/* khi users click ảnh thì selectedPhoto sẽ là true */}
      {selectedPhoto && (
        <PhotoDetail
        // photo là đối tượng cần render
          photo={selectedPhoto}
          // onClose hàm callback được sử dụng để đóng Moda
          onClose={() => setSelectedPhoto(null)}
          // onDelete là hàm callback được sử dụng để xử lý cập nhật giao diện sau khi Modal thực hiện thao tác xóa ảnh ở backend thành công
          onDelete={(id) => {
            // tạo ra một mảng mới có tất cả các đối tượng ảnh mà id khác với id của ảnh vừa bị xóa, sau đó cập nhật state
            setPhotos(prev => prev.filter(p => p._id !== id));
            setSelectedPhoto(null);
          }}
        />
      )}
    </div>
  );
};
// export mặc định đối tượng PhotoPage
export default PhotoPage;
