
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
// pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Recos from './pages/Recos';

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/recos" element={<Recos />} />
          </Routes>

        </div>
      </BrowserRouter>
    </AuthContextProvider>

  );
}

export default App;
