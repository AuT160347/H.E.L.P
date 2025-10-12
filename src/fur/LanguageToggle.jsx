import { useState } from "react";
import './LG.css'

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <button
      className="lang-btn"
      onClick={() => setLanguage(!language)}
    >
      {language ? "TH" : "EN"}
    </button>
  );
};

export default LanguageToggle;

