import { Route, Routes } from "react-router-dom";

import UserHome from "@/pages/user/UserHome";
import Login from "./pages/user/Login";

function App() {
  return (
    <Routes>
      <Route element={<UserHome />} path="/" />
      <Route element={<Login />} path="/login" />
    </Routes>
  );
}

export default App;
