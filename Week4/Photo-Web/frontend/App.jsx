

import {BrowserRouter, Routes, Route} from "react-router-dom";

import PhotoPage from "./pages/PhotoPage.jsx";
import PhotoDetail from "./components/PhotoDetail.jsx";
import AddPhotos from "./components/AddPhotos.jsx";
import MainLayout from "./pages/MainLayout.jsx";

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
         
          <Route path="/" element={
            <MainLayout>
                <PhotoPage />
              </MainLayout>
            } />
          <Route path="/add" element={
            <MainLayout>
                <AddPhotos />
              </MainLayout>
            } />
            <Route path="/:id" element={
            
                <PhotoDetail />
              
            } />          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
