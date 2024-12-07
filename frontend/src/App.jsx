import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";


function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editor/:id" element={<EditorPage/>} />
      </Routes>
    </>
  )
}

export default App
