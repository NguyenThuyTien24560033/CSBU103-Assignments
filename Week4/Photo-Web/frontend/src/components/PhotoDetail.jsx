// import file css
import "./PhotoDetail.css";
// khai báo hàm tên PhotoDetail truyền vào 3 props
// photo là chứa đối tượng thông tin ảnh đang được xem
// onClose là hàm đóng modal
// onDelete là hàm xóa ảnh
const PhotoDetail = ({ photo, onClose, onDelete }) => {
// không có photo thì không render
  if (!photo) return null; 
// khai báo hàm tên handleDelete dùng để xử lí xóa ảnh
  const handleDelete = async () => {
    // xác nhận lại users có thật sự muốn xóa ảnh ko
    if (!confirm("Are you sure you want to delete this photo?")) return;
  // gửi request DELETE lên backend xử lí
    try {
      // tạo 1 biến tên res chứa đối tượng Response được trả về từ server
       // await bắt chờ cho đến khi nhận phản hồi
      // fetch chính là fetch API để tạo yêu cầu mạng 
      // http://localhost:8000/api/${photo._id} chính là endpoint, /api là tuyến đường, đây chứa id tài liệu cần trỏ đến
      const res = await fetch(`http://localhost:8000/api/${photo._id}`, {
        // phương thức HTTP DELETE
        method: "DELETE",
        // dữ liệu trong phần body được mã hóa dưới dạng JSON
        headers: { "Content-Type": "application/json" },
      });
      // khai báo biến data chứa dữ liệu phản hồi cuối cùng từ backend về frontend
      const data = await res.json();
      // nếu respond ok thì hiện thông báo cho người dùng là xóa thành công
      //  onDelete(photo._id); là 1 hàm callback, update state và đóng modal
      if (res.ok) {
        alert(data.message || "Deleted");
        onDelete(photo._id); 
        // ngược lại thì hiện thông báo về việc xóa thất bại
      } else {
        alert(data.message || "Delete failed");
      }
      // nếu có bất kì lỗi nào thì bắt lấy và console 1 error với 1 popup báo lỗi 
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };
// UI
  return (
    // lớp phủ nền mờ, nếu bấm vô đây thì modal đóng, nhưng bấm vô modal thì không đóng vì đã chặn sự kiện lan lên
    <div className="photo-overlay" onClick={onClose}>
    {/* hộp thoại Modal chính chứa nội dung ảnh */}
    {/* đảm bảo rằng khi người dùng nhấp vào bên trong modal, hàm onClose sẽ không bị kích hoạt */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
        {/* tạo một nút bấ X, khi nhấn vào thì kích hoạt onClose */}
        <button className="btn-close" onClick={onClose} >✕</button>
          {/* khu vực hiển thị ảnh */}
          <img
            src={
              // Kiểm tra xem URL ảnh (photo.coverImage) có bắt đầu bằng "http" hoặc "https" hay không
              photo.coverImage?.startsWith("http")
              // đúng thì ảnh được lưu dưới dạng URL Internet
                ? photo.coverImage 
                //  dạng base 64
                : photo.coverImage?.startsWith("data:image")
                // dạng uploads lên server
                ? photo.coverImage                                               
                : `http://localhost:8000/${photo.coverImage}`                     
            }
            // ảnh bị lỗi gì đó thì hiển thị nội dung thay thế
            alt="image"
            className="modal-image"
          />

          <div className="modal-actions">
          {/* tạo một nút delete, khi nhấn nút thì hàm handleDelete kích hoạt */}
            <button className="btn-delete" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};
// export mặc định đối tượng PhotoDetail
export default PhotoDetail;
