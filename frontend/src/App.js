import logo from './logo.svg';

// 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  console.log(process.env.REACT_APP_TEST)
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <div className="App">

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
