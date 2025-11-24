import { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";
import "./stepper.css";

const Stepper = ({ step }) => {
    const { language, text } = useContext(LanguageContext);
    
    
    const t = text[language].stepper;

    return (
        <div className="stepper-container">

            
            <div className={`step-item ${step >= 1 ? "active" : ""}`}>
                <div className="step-circle">1</div>
                
                <span>{t.step1}</span>
            </div>

            <div className="step-line"></div>

            
            <div className={`step-item ${step >= 2 ? "active" : ""}`}>
                <div className="step-circle">2</div>
                <span>{t.step2}</span>
            </div>

            <div className="step-line"></div>

            
            <div className={`step-item ${step >= 3 ? "active" : ""}`}>
                <div className="step-circle">3</div>
                <span>{t.step3}</span>
            </div>

        </div>
    );
};

export default Stepper;