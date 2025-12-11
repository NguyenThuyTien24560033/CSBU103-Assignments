// import thư viện useState để xử lí các state
import { useState } from "react";
// import css
import "./HomePage.css";
// import Header
import Header from "../component/Header.jsx";
// import UserLogin
import UserLogin from "./UserLogin.jsx";

// khai báo hàm HomePage => trang chính
const HomePage = () => {
  // khai báo state:  điều khiển mở form login/register
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <div className="home-container">
      {/* khi mà mà nhận props onLoginClick thì hàm cập nhật state setShowLoginForm là true => mở form login/register */}
      <Header onLoginClick={() => setShowLoginForm(true)} />
      {/* nếu như state showLoginForm true thì nhận props onBack thì đóng form login/register */}
      {showLoginForm && (
        <UserLogin onBack={() => setShowLoginForm(false)} />
      )}
      </div>
  );
};
// export mặc định hàm HomePage
export default HomePage;


