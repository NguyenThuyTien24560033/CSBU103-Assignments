// import hàm Header từ ../components/Header.jsx
import Header from "../components/Header.jsx";


// khai báo hàm tên MainLayout, prop đặc biệt tên là children
const MainLayout = ({ children }) => {
  return (
    <div>
    {/* thanh header luôn hiển thị ở trên cùng của trang, bất kể nội dung chính thay đổi như thế nào */}
      <Header />
      {/* chứa nội dung chính của trang */}
      {/* đây là nơi route con render */}
      <main>{children}</main> 

    </div>
  );
};
// export mặc định đối tượng MainLayout
export default MainLayout;
