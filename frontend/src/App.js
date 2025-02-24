
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar';


function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/account" element={<Home />} />
          </Routes>

        </div>
      </BrowserRouter>
    </AuthContextProvider>

  );
}

export default App;
