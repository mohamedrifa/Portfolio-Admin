import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import { ProtectedRoute, PublicOnlyRoute } from "./route/routes";

export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/resume/:id" element={<Resume />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
