import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import FileUpload from './pages/FileUpload'
import Home from './pages/Home'
import QuestionAndAnswer from './pages/QuestionAndAnswer'
function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path = "/login" element={<Login/>}>
      
      </Route>
      <Route path = "/register" element={<Register/>}/>
      <Route path=  "/fileUpload" element = {<FileUpload/>}/>
      <Route path='/questionAndAnswer' element={<QuestionAndAnswer/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
