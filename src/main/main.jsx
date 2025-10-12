import { useState } from "react";
import LanguageToggle from "../fur/LanguageToggle";
import Home from "../fur/home";
import "./main.css";


const Main = () => {
  const [activePage, setActivePage] = useState("home");
  const [language, setLanguage] = useState(false); // false = EN, true = TH

  return (
    <div className="borderDA">
      {/* Navbar */}
      <div className="main-menu">
        <div className="d-flex justify-content-between align-items-center px-3">
          <h1>H.E.L.P</h1>
          <div>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setActivePage("home")}
            >
              {language ? "หน้าแรก" : "Home"}
            </button>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setActivePage("date")}
            >
              {language ? "วันที่" : "Date"}
            </button>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setActivePage("chat")}
            >
              {language ? "แชท" : "Chat"}
            </button>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setActivePage("history")}
            >
              {language ? "ประวัติ" : "History"}
            </button>
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </div>
      

      {/* Main content */}
      <div className="mt-4 px-3">
        {activePage === "home" && <Home language={language} />}
        {activePage === "date" && <h2>{language ? "หน้าวันที่" : "Date Page"}</h2>}
        {activePage === "chat" && <h2>{language ? "หน้าแชท" : "Chat Page"}</h2>}
        {activePage === "history" && <h2>{language ? "หน้าประวัติ" : "History Page"}</h2>}
      </div>
    </div>
  );
};

export default Main;
