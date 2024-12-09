import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import PlayGame from "./component/playGame";

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editor/:id" element={<EditorPage/>} />
        <Route path="/m" element={<PlayGame/>}/>
      </Routes>
    </>
  )
}

export default App
