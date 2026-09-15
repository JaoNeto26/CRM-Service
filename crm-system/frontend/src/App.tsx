import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calendar from "./pages/calendar";
import Home from "./pages/home";
import Login from "./pages/login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
