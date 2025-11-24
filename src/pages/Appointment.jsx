import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3"; // ✅ เพิ่ม Step3

const Appointment = () => {
    const [step, setStep] = useState(1);

    // ✅ State เก็บข้อมูลรวม
    const [formData, setFormData] = useState({
        preferredDate: "",
        preferredTime: "",
        backupDate: "",
        backupTime: "",
        department: "",
        doctor: "auto",
        doctorName: "",
    });

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <>
            {step === 1 && (
                <Step1 
                    next={() => setStep(2)} 
                    updateFormData={updateFormData}
                    formData={formData}
                />
            )}
            {step === 2 && (
                <Step2 
                    prev={() => setStep(1)} 
                    next={() => setStep(3)} 
                    updateFormData={updateFormData} // ✅ ส่ง prop นี้
                    formData={formData}
                />
            )}
            {step === 3 && (
                <Step3 
                    prev={() => setStep(2)}
                    formData={formData} // ✅ ส่งข้อมูลไปแสดงผล
                />
            )}
        </>
    );
};

export default Appointment;