// import từ thư viện react-router-dom
// Routes là tất cả các route
// Route là 1 route cụ thể
import { Routes, Route } from "react-router-dom"; 
// import CalculatorPage từ pages/CalculatorPage.jsx
import CalculatorPage from "../pages/CalculatorPage.jsx";
//  App() component gốc của ứng dụng
function App() {
  return (
    <Routes>
    {/* khi URL là / thì render <CalculatorPage /> */}
      <Route
        path="/"
        element={
          <CalculatorPage />
        }
      />
    </Routes>
  );
}
// export mặc định App
export default App;