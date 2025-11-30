// import Link từ react-router-dom, 
// tạo các liên kết điều hướng nội bộ
import { Link } from "react-router-dom";
// import file css
import "./Header.css";
// khai báo hàm Header
  const Header = ({  }) => {
  return (
    <header className="main-header">
        <nav className="main-top-header">
        {/* Link là component điều hướng */}
        {/* to chỉ định đường dẫn nội bộ */}
        {/* / là đường dẫn gốc */}
          <Link to="/" className="nav-item">
          {/* users thấy Home và có thể nhấp vào */}
            <p className="home">Home</p>
          </Link>
          {/* khi uses thấy và nhấp vào + thì ứng dụng sẽ chuyển hướng đến đường dẫn /add */}
          <Link to="/add" className="nav-item">
            <p className="add">+</p>
          </Link>
        </nav>
    </header>
  );
};
// export mặc định đối tượng Header
export default Header;



