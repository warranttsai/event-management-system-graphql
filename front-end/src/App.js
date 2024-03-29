import { BrowserRouter, Route, Routes } from "react-router-dom";
// css
import "./App.css";
// page
import Auth from "./pages/Auth";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
