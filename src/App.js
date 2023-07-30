import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AccountActivationPage from "./pages/ActivationPage";
import LanguageSelector from "./components/LanguageSelector";
import UserPage from "./pages/UserPage";

import "./App.css";

function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <nav className="nav-bar">
          <Link to="/"       title="Home">Home</Link>
          <Link to="/signup" title="Sign Up">{t("SignUp")}</Link>
          <Link to="/login"  title="Login">{t("login")}</Link>
        </nav>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/activate/:token" element={<AccountActivationPage />} />
        </Routes>
        <LanguageSelector />
      </div>
    </BrowserRouter>
  );
}

export default App;

/*

path.startsWith("/user/") && <UserPage />

  const onClickLink = (event) => {
    event.preventDefault();
    const path = event.target.attributes.href.value;
    window.history.pushState({}, "", path);
    setPath(path);
  };

*/
