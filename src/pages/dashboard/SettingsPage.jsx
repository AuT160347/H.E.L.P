import { useContext, useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { LanguageContext } from "../../components/LanguageContext";

export default function SettingsPage() {
  const { language, toggleLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    if (newLang !== language) {
      toggleLanguage(); // ของเดิมคุณมีอยู่แล้ว
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Settings</h2>


      <Card className="p-4">
        <h5 className="mb-3">Language</h5>
        <Form.Select value={language} onChange={handleLanguageChange}>
          <option value="TH">ภาษาไทย</option>
          <option value="EN">English</option>
        </Form.Select>
      </Card>
    </div>
  );
}
