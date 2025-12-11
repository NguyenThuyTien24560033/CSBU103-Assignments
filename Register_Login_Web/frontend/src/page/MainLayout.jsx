// import Header
import Header from "../component/Header.jsx";

// khai báo hàm MainLayout => xử lí layout khung cố định của trang web, nhận props là children
const MainLayout = ({ children }) => {
  return (
    <div>
    {/* luôn hiển thị Header */}
      <Header />
      {/* những nội dụng còn lại của cách trang */}
      <main>{children}</main> 

    </div>
  );
};
// export mặc định hàm MainLayout
export default MainLayout;
