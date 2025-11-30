// import các thư viện và components
import { Routes, Route, useLocation } from "react-router-dom";
import PhotoPage from "./pages/PhotoPage.jsx";
import PhotoDetail from "./components/PhotoDetail.jsx";
import AddPhotos from "./components/AddPhotos.jsx";
import MainLayout from "./pages/MainLayout.jsx";
//  App() component gốc của ứng dụng
function App() {
  // khai báo biến tên location chứa thông tin về URL hiện tại của trình duyệt
  const location = useLocation();
  // khai báo biến tên state trích xuất thuộc tính state từ đối tượng location
  const state = location.state;

  return (
    <>
      {/* Router chính cho trang nền */}
    {/* check xem state có tồn tại và có chứa thuộc tính backgroundLocation hay không */}
    {/* nếu ko thì <Routes> sẽ quay lại sử dụng đối tượng location hiện tại của trình duyệt */}
    {/* mục đích ở đây là để Routes chỉ render đường dẫn / hoặc /add dù url thực tế có thêm /id */}
      <Routes location={state?.backgroundLocation || location}>
        <Route
        // đường dẫn gốc /
          path="/"
          element={
            // dùng MainLayout bọc nội dung chính là PhotoPage
            <MainLayout>
              <PhotoPage />
            </MainLayout>
          }
        />

        <Route
        // đường dẫn truy cập /add
          path="/add"
          element={
            // dùng MainLayout bọc nội dung chính là AddPhotos
            <MainLayout>
              <AddPhotos />
            </MainLayout>
          }
        />
      </Routes>

     
    </>
  );
}
// export mặc định đối tượng App
export default App;
