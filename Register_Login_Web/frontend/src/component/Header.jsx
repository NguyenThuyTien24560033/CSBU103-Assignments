// import hook useState tạo state trong component function
// import hook useEffect xử lý side-effects
// import hook useRef tạo biến lưu giá trị mà thay đổi nhưng không render lại component
import { useEffect, useState, useRef } from "react";
// import hook Link tạo đường dẫn (navigate) giữa các trang nhưng không reload trang
// import hook useNavigate điều hướng trang
import { Link, useNavigate } from "react-router-dom";
// import css
import "./Header.css";
// import icon User từ thu viện lucide-react
import { User } from "lucide-react";

// khai báo hàm Header nhận props onLoginClick, khi gọi onLoginClick thì setShowLoginForm bên HomePage sẽ nhận true và mở form
const Header = ({ onLoginClick }) => {
  // điều hướng
  const navigate = useNavigate();
  // state user và hàm cập nhật state setUser chứa data user
  const [user, setUser] = useState(() => {
    // dùng JWT để lấy data user trong browser và lưu vào stored
    const stored = localStorage.getItem("user");
    // kiểm tra xem stored có tồn tại ko, nếu có thì chuyển data thành dạng object JS, nếu ko thì trả về null 
    return stored ? JSON.parse(stored) : null;
  });
  // state menuOpen và hàm cập nhật state setMenuOpen dùng để điều khiển dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  // khai báo biến menuRef lưu current, kiểm tra xem user có click ra ngoài menu không
  const menuRef = useRef(null);

  // lắng nghe sự kiện userChanged 
  useEffect(() => {
    // khai báo hàm handleUserChange để xử lí xem user có thay đổi ko
    const handleUserChange = () => {
      // dùng JWT để lấy data user trong browser và lưu vào stored
      // // kiểm tra xem stored có tồn tại ko, nếu có thì chuyển data thành dạng object JS, nếu ko thì trả về null 
      // cập nhật lại user khi có thay đổi
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    // lắng nghe, nếu có userChanged xảy ra phải chạy lại hàm handleUserChange để mà cập nhật lại user
    window.addEventListener("userChanged", handleUserChange);
    // khi mà unmount (log out) thì hủy việc lắng nghe, tránh việc rò rỉ bộ nhớ và duplicate listeners gây bug
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);


  useEffect(() => {
    // khai báo hàm handleClickOutside xử lí việc đóng menu dropdown khi click ra ngoài
    const handleClickOutside = (e) => {
      // kiểm tra xem menu tồn tại ko và users click ra ngoài menu thì đóng menu
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    // lắng nghe sự kiện click, mỗi khi click trong trong thì gọi hàm handleClickOutside xử lí
    document.addEventListener("click", handleClickOutside);
    // sau khi unmount thì hủy việc lắng nghe, tránh việc rò rỉ bộ nhớ và duplicate listeners gây bug
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //  khai báo hàm handleLogout xử lý logout
  const handleLogout = () => {
    // xóa JWT user => log out => user =null
    localStorage.removeItem("user");
    // xóa token
    localStorage.removeItem("token");
    // báo cho toàn bộ ứng dụng rằng user đã thay đổi
    window.dispatchEvent(new Event("userChanged"));
    // cập nhật state setMenuOpen thành false
    setMenuOpen(false);
    // quay về trang chủ
    navigate("/");
  };

  return (
    <header className="main-header">
      <div className="top-content-header">
       {/* menu chính, khi mà click home sẽ về lại trang chủ */}
        <nav className="main-top-header">
          <Link to="/" className="nav-item">
            Home
          </Link>
        </nav>

        {/* góc phải: Login hoặc User Dropdown */}
        <div className="login-container-bt" ref={menuRef}>
        {/* kiểm tra xem đã có user chưa, nghĩa là login chưa */}
          {user ? (
            <div className="user-menu">
              {/* nếu login rồi, thì khi click vào icon + name/email thì hàm cập nhật nhật statw setMenuOpen sẽ nhận giá trị phủ định của menuOpen */}
              {/* nếu mà menuOpen đang false nghĩa là dropdown đang đóng, khi click thì mở dropdown và ngược lại */}
              <button
                className="user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {/* hiện icon User có kích thước 40 */}
                <User className="user-icon" size={40} />
                {/* nếu như data user có name thì hiện name, ko có name thì hiện email */}
                <span className="user-name">{user.name || user.email}</span>
              </button>
              {/* nếu dropdown đang mở, thì sẽ hiển thị Profilw và Logout */}
              {menuOpen && (
                <div className="dropdown-menu">
                {/* khi mà click vào Profile thì navigate tới path /profilw và đóng dropdown */}
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {/* còn nếu nhấn Logout thì gọi hàm handleLogout để xử lí logout */}
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // trường hợp user chưa tồn tại, nghĩa là chưa có login  
            //lúc này bên trên thanh header sẽ hiển thị nút login, khi click vào thì gọi onLoginClik để đăng nhập
            <button
              className="login-bt"
              onClick={() => {
                if (onLoginClick) onLoginClick();
              }}
            >
              Login
            </button>
            
          )}
        </div>
      </div>
    </header>
  );
};

// export mặc định hàm Header
export default Header;
