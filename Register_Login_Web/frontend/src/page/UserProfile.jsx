// import useState để quản lý state trong component
import { useState, useEffect } from "react";
// import useNavigate để điều hướng page
import { useNavigate } from "react-router-dom";
// import css
import "./UserProfile.css";
// import icon User từ thư viện lucide-react
import { User } from "lucide-react";
// import Toaster và toast từ thư viện sonner để hiển thị thông báo
import { Toaster, toast } from "sonner";

// khai báo hàm UserProfile xử lí profile của users
const UserProfile = () => {
// hook điều hướng
  const navigate = useNavigate();

// lưu thông tin user đăng nhập
  const [user, setUser] = useState(null);
// chế độ chỉnh sửa profile
  const [editing, setEditing] = useState(false);
// lưu dữ liệu của form khi user đang chỉnh sửa
  const [formData, setFormData] = useState({});
// chế độ đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);


/// mật khẩu cũ của user 
  const [oldPassword, setOldPassword] = useState("");
// mật khẩu mới của user
  const [newPassword, setNewPassword] = useState("");
// xác nhận mật khẩu của user
  const [confirmPassword, setConfirmPassword] = useState("");

// API chứa URL của API endpoint để gửi request đến server
// URL trỏ đến server chạy trên máy local (localhost) ở cổng 5005
// /api/users là endpoint của server, thường dùng để gửi request liên quan tới user
  const API_BASE = "http://localhost:5005/api/users";

    useEffect(() => {
    // lưu data của user vào storeUser
    const storedUser = localStorage.getItem("user");
    // nếu như stroreUser ko tồn tại nghĩa là chưa có đăng nhập
    if (!storedUser) {
    // chuyển hướng đến http://localhost:5005/api/users
      navigate("/users"); 
    // dừng chạy code bên dưới
      return;
    }
    // khai báo biến userData lưu data user dạng object JS
    const userData = JSON.parse(storedUser);
    // cập nhật state => lưu thông tin user vào state user
    setUser(userData);
    // cập nhật state => lưu dữ liệu user vào state formData => hiển thị thông tin trên trang profile
    setFormData(userData);
  }, []);


  // cập nhật state formData khi user gõ vào input
  const handleChange = (e) => {
  //     //  ...formData lấy toàn bộ data của object cũ, tạo thành 1 object mới
  //     // [e.target.name]: e.target.value ghi đè những trường dữ liệu muốn thay đổi
  //     // lưu vào hàm cập nhật setFormData => cập nhật sate formData
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  try {
    // kiểm tra format của email theo regex
    // regex: /^[^\s@]+: bắt đầu chuỗi thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // @: sau đó là kí tự @
    // [^\s@]+: đi sau kí tự @ thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // \. tiếp theo là kí tự dấu .
    // [^\s@]+: đi sau kí tự dấu . thì ko được chứa 1 hoặc nhiều các khoảng trắng và kí tự @
    // $/: kết thúc chuỗi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // kiểm tra email có khớp với điều kiện đã đặt ra trong emailRegex hay ko
    // nếu ko thì báo lỗi và dừng
    if (formData.email && !emailRegex.test(formData.email)) {
      toast.error("Email is incorrectly formatted");
      return false;
    }
    
    // lấy JWT token từ localStorage -> dùng để xác thực request
      const token = localStorage.getItem("token");
    // gửi req đến tới URL: http://localhost:3000/api/users/id  và lưu res trả về vào response
      const response = await fetch(`${API_BASE}/${user._id || user.id}`, {
        // phương thức PUT
        method: "PUT",
        // dữ liệu gửi đi là JSON và xác nhận user
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

     // chuyển đối tượng thành JSON để gửi lên server
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          address: formData.address,
          email: formData.email,


        }),
      });
      // khai báo biến data chứa response trả về dạng object JS
      const data = await response.json();
    // nếu res ko có ok thì thông báo lỗi và trả về null
    if (!response.ok){
    toast.error(data.message || "Update failure");
    return null;
    }


    // khai báo biến updated rồi chuyển response từ server thành đối tượng JavaScript lưu vào
    // const updated = await response.json();
    // lưu data user mới vào localStorage
    localStorage.setItem("user", JSON.stringify(data));
    // cập nhật state user => render UI
    setUser(data);
    // tắt form edit
    setEditing(false);
    // tạo event toàn cục để các component khác biết user đã thay đổi, từ đó lắng nghe và tự render mà ko cần reload
    window.dispatchEvent(new Event("userChanged"));
    // nếu như thành công hết thì hiện thông báo pop-up thành công
    toast.success("Update successful!");

 // nếu có lỗi thì bắt lỗi, hiện thông báo lỗi
    } catch (err) {
    console.error("Error when updating:", err);
    toast.error("Update failed");
    }
  };


  // khai báo hàm tên handleLogout xử lí việc logout 
  const handleLogout = () => {
    // tìm user và xóa nó khỏi browser
    localStorage.removeItem("user");
    // xóa JWK token để chặn gọi API
    localStorage.removeItem("token");
    // tạo event toàn cục để các component khác biết user đã thay đổi, từ đó lắng nghe và tự render mà ko cần reload
    window.dispatchEvent(new Event("userChanged"));
    // chuyển hướng về homepage
    navigate("/");
  };


  //  khai báo hàm handleChangePassword để xử lí việc thay đổi mật khẩu
  const handleChangePassword = async (e) => {
    // ngăn chặn việc reload mặc định của trang
    // tránh việc hàm xử lí chưa xong hoặc bị reload rồi mất dữ liệu
    e.preventDefault();

    // kiểm tra xem newPassword và confirmPassword có khớp nhau ko, ko thì báo lỗi và dừng
    if (newPassword !== confirmPassword) {
      toast.error("The new password and confirm password do not match!");
      return;
    }

    // kiểm tra password: ít nhất 6 ký tự + 1 số + 1 ký tự đặc biệt
    // regex: /^...$/ kiểm tra từ đầu cho đến cuối chuỗi
    // (?=.*[0-9]): chuỗi phải chứa ít nhất 1 ký tự số từ 0->9 ở bất kỳ vị trí nào
    // (?=.*[=`~!@#$%^&*+-]): chuỗi phải chứa ít nhất 1 ký tự đặc biệt nằm ở trong ngoặc vuông ở bất kỳ vị trí nào
    // [A-Za-z0-9=`~!@#$%^&*+-]: cho phép mật khẩu chỉ chứa những ký tự trong ngoặc vuông: từ A->Z, a->z, 0->9 và các kí tự đặc biệt =`~!@#$%^&*+-
    // {6,}: phải dài ít nhất 6 ký tự
    const passwordRule = /^(?=.*[0-9])(?=.*[=`~!@#$%^&*+-])[A-Za-z0-9=`~!@#$%^&*+-]{6,}$/;
    // kiểm tra xem newPassword có khớp với các yêu cầu trong regex ko, nêu ko thì báo lỗi và dừng
    if (!passwordRule.test(newPassword)) {
      toast.error("Password should contains at least 1 number and 1 special character(=`~!@#$%^&*+-)");
      return;
    }

    try {
      // lấy JWT token từ localStorage -> dùng để xác thực request
      const token = localStorage.getItem("token");
      // gửi req đến tới URL: http://localhost:5005/api/users/id/change và lưu vào res trả về vào res
      const res = await fetch(`${API_BASE}/${user._id || user.id}/change`, {
     
        // phương thức PUT
        method: "PUT",
        // gửi đi dạng json và xác thực user
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // chuyển đối tượng thành JSON để gửi lên server
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      // khai báo biến data lưu res dạng object JS
      const data = await res.json();
      // ko thành công thì hiện thông báo pop-up và trả về null
        if (!res.ok) {
        toast.error(data.message || "Err changing password!");
        return null;
        }
      // nếu thành công thì hiện thông báo pop-up
      toast.success("Password changed successfully!");
      // cập nhật sate oldPassword, newPassword, confirmPassword về ""
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
          // nếu có lỗi thì bắt lỗi, hiện thông báo lỗi
      } catch (error) {
        toast.error(data.message || "Err changing password!");
      }
    };


  // sau khi hoàn thành hết thì kiểm tra lại user lần nữa trước khi render
  if (!user) return null;


  return (
    
    <div className="profile-container">
      {/* Toaster: component của thư viện sonner dùng để hiển thị thông báo toast */}
      {/* position="top-center": đặt toast ở giữa phía trên màn hình */}
      {/* richColors: dùng màu sắc đẹp hơn cho toast */}

      <Toaster position="top-center" richColors />

    <div className="profile-card ">
      
      {/* nếu showChangePassword là true thì hiện form đổi mật khẩu */}
      {showChangePassword ? (
        <div className="modal-overlay"> 
          <div className="modal-content">
            {/* tiêu đề */}
            <h3>Change Password</h3>
            {/* form, nhấn submit thì gọi hàm handleChangePassword để xử lí */}
            <form className="change-password-form" onSubmit={handleChangePassword}>
              {/* input password
              value={oldPassword}: liên kết với state oldPassword
              onChange={(e) => setOldPassword(e.target.value)}: cập nhật setOldPassword khi user nhập
              required: bắt buộc phải nhập 
          */}
             <input
                type="password"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              {/* input password
                    value={newPassword}: liên kết với state newPassword
                   onChange={(e) => setNewPassword(e.target.value)}: cập nhật setNewPassword khi user nhập
                    required: bắt buộc phải nhập 
                 */}
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {/* input password
                  value={confirmPassword}: liên kết với state confirmPassword
                  onChange={(e) => setConfirmPassword(e.target.value)}: cập nhật setConfirmPassword khi user nhập
                  required: bắt buộc phải nhập 
              */}
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {/* submit form bằng nút save */}
              <button type="submit" className="save-btn">
                Save
              </button>
            </form>

            {/* trường hợp nhấn nút cancel
                đóng form đổi mật khẩu
                state oldPassword, newPassword, confirmPassword đều đc set lại giá trị ""
            */}
            <button
              onClick={() => {
                setShowChangePassword(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="close-btn"
            >
              Cancel
            </button>
          </div>
        </div>
            ) : (
        <>
       {/* trong trường hợp showChangePassword là false */}
        {/* hiện 1 cái icon user */}
          <User className="profile-icon" />
        <div className="profile-info">
            {/* xử lí việc render thông tin cập nhật bằng hàm handleChange*/}
            {/* cần dùng name để xác định trường cần cập nhật
                value={formData.name || ""}: nếu trong fromData.name có giá trị thì lấy ko thì lấy ""
                onChange={handleChange}: khi người dùng gõ vào input thì gọi hàm handleChange để xử lí
                disabled={!editing}: vì giá trị mặc định ở đây của editing là false nên mặc định cũng sẽ ko cho gõ input, trừ phi người dùng nhấn edit bên dưới
             */}
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Your name"
          />
            {/* xử lí việc render thông tin cập nhật bằng hàm handleChange*/}
            {/* cần dùng name để xác định trường cần cập nhật
                value={formData.gender || ""}: nếu trong formData.gender có giá trị thì lấy ko thì lấy ""
                onChange={handleChange}: khi người dùng gõ vào input thì gọi hàm handleChange để xử lí
                disabled={!editing}: vì giá trị mặc định ở đây của editing là false nên mặc định cũng sẽ ko cho gõ input, trừ phi người dùng nhấn edit bên dưới
            */}
          <input
            type="text"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Gender"
          />

          {/* xử lí việc render thông tin cập nhật bằng hàm handleChange*/}
            {/* cần dùng name để xác định trường cần cập nhật
                value={formData.email || ""}: nếu trong formData.email có giá trị thì lấy ko thì lấy ""
                onChange={handleChange}: khi người dùng gõ vào input thì gọi hàm handleChange để xử lí
                disabled={!editing}: vì giá trị mặc định ở đây của editing là false nên mặc định cũng sẽ ko cho gõ input, trừ phi người dùng nhấn edit bên dưới
            */}
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={!editing} 
            placeholder="Email"
          />

          {/* xử lí việc render thông tin cập nhật bằng hàm handleChange*/}
            {/* cần dùng name để xác định trường cần cập nhật
                value={formData.address || ""}: nếu trong formData.address có giá trị thì lấy ko thì lấy ""
                onChange={handleChange}: khi người dùng gõ vào input thì gọi hàm handleChange để xử lí
                disabled={!editing}: vì giá trị mặc định ở đây của editing là false nên mặc định cũng sẽ ko cho gõ input, trừ phi người dùng nhấn edit bên dưới
            */}
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Address"
          />
            {/* hiển thị ngày đăng kí tài khoản
                tìm trường createdAt trong user  
                new Date(user.createdAt): chuyển chuỗi ngày tháng từ database thành object Date của JS
                .toLocaleDateString("vi-VN"): chuyển object Date  thành "dd/mm/yyyy"
             */}
          <p className="registration-date">
            Registration date:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("vi-VN")
              : ""}
          </p>
        </div>

          {/* phần form edit */}
          <div className="button-group">
          {/* nếu editing là false thì kiểm tra role của nó, ko chấp nhận librarian, chỉ chấp nhận role user */}
            {!editing ? (
                <>
                  {/* nhấn nút edit thì bật form edit lên => cho phép users gõ input*/}
                  <button onClick={() => setEditing(true)} className="edit-btn">
                   Edit
                  </button>
                   {/* nhấn nút Change Password thì bật form đổi mật khẩu lên */}
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="password-btn"
                  >
                   Change Password
                  </button>
                {/* nhấn logout thì gọi hàm handleLogout xử lí*/}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
            </>
          ) : (
            <>
              {/* nếu edit true thì xử lí nút save bằng gọi hàm handleSave xử lí */}
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
                {/* và nút Cancel khi nhấn thì cập nhật lại setEditing là false để đóng form edit */}
                <button onClick={() => {
                    setEditing(false);
                    setFormData(user); 
                  }}  className="cancel-btn">
                  Cancel
                </button>
            </>
            )}
        </div>
        </>
       )}
    </div>
    </div>
  );
};

// export mặc định hàm UserProfile
export default UserProfile;