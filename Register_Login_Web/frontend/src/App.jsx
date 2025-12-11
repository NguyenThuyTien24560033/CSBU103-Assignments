import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from "./page/HomePage.jsx";
import UserLogin from "./page/UserLogin.jsx";
import UserProfile from "./page/UserProfile.jsx";
import MainLayout from "./page/MainLayout.jsx";
function App() {
  return (
    <>
    {/*dùng BrowserRouter trang để cả web điều hướng được */}
      <BrowserRouter>
        <Routes>
        {/* router HomePage path =/ */}
          <Route
            path="/"
            element={
              <HomePage />
              }
          />
          {/* router UserLogin path: /users */}
          <Route 
            path="users" element={
            <UserLogin />
            } />
            {/* router UserProfile  path: /profile nhưng sẽ chứa layout chung*/}
          <Route 
            path="/profile" element={
            <MainLayout>
                <UserProfile />
              </MainLayout>
            } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
