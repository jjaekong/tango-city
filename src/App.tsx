import { Route, Routes } from "react-router-dom";

import UserHome from "@/pages/user/UserHome";

function App() {
  return (
    <Routes>
      <Route element={<UserHome />} path="/" />
    </Routes>
  );
}

export default App;
