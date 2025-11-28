import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("TH");

  // โหลดภาษาเดิมที่เคยเลือกไว้
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
  }, []);

  // บันทึกภาษาใหม่เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "TH" ? "EN" : "TH"));
  };

  const text = {
    TH: {
      // --- Navbar ---
      navbar: {
        admin: [
          { name: "หน้าแรก", path: "/home" },
          { name: "ค้นหา", path: "/search?query=" },
        ],
        patient: [
          { name: "หน้าแรก", path: "/home" },
          { name: "จองนัด", path: "/appointment" },
          { name: "ประวัติ", path: "/history" },
          { name: "ค้นหา", path: "/search?query=" },
        ]
      },

      // --- Login & Register ---
      login: {
        title: "เข้าสู่ระบบ",
        submit: "เข้าสู่ระบบ",
        noAccount: "ยังไม่มีบัญชี?",
        registerLink: "สมัครสมาชิก",
        successTitle: "เข้าสู่ระบบสำเร็จ!",
        welcome: "ยินดีต้อนรับ",
        errorTitle: "เกิดข้อผิดพลาด",
      },
      register: {
        title: "สมัครสมาชิก",
        submit: "สมัครสมาชิก",
        haveAccount: "มีบัญชีอยู่แล้ว?",
        loginLink: "เข้าสู่ระบบ",
        successTitle: "สมัครสมาชิกสำเร็จ",
        successText: "กรุณารอผู้ดูแลระบบอนุมัติบัญชี",
        errorText: "ไม่สามารถสมัครสมาชิกได้",
      },

      // --- Common Form Labels ---
      form: {
        firstname: "ชื่อ",
        firstnamePh: "กรอกชื่อ",
        lastname: "นามสกุล",
        lastnamePh: "กรอกนามสกุล",
        email: "อีเมล",
        emailPh: "กรอกอีเมล",
        dob: "วันเกิด",
        gender: "เพศ",
        selectGender: "เลือกเพศ",
        male: "ชาย",
        female: "หญิง",
        other: "อื่น ๆ",
        username: "ชื่อผู้ใช้",
        usernamePh: "กรอกชื่อผู้ใช้",
        password: "รหัสผ่าน",
        passwordPh: "กรอกรหัสผ่าน",
      },
      ok: "ตกลง",
      error: "เกิดข้อผิดพลาด",

      // --- Appointment (Step 1) ---
      appointment: {
        title: "การนัดหมาย",
      },

      // Appointment — STEP 1 (TH)

      step1: {
        header: "ข้อมูลการนัดหมาย",
        preferredDate: "วันนัดหลัก",
        backupDate: "วันนัดสำรอง",
        preferredTime: "เลือกเวลา",
        backupTime: "เลือกเวลาสำรอง",
        selectTime: "เลือกเวลา",
        hospital: "โรงพยาบาล",
        department: "แผนก",
        doctor: "แพทย์",

        auto: "ให้ระบบเลือกให้ฉัน",
        manual: "เลือกแพทย์เอง",

        selectMainDate: "กรุณาเลือกวันนัด",
        selectHospital: "กรุณาเลือกโรงพยาบาล",
        selectDepartment: "กรุณาเลือกแผนก",

        next: "ถัดไป →",
      },


      // Appointment — STEP 2 (TH)

      step2: {
        header: "บุคคลที่ต้องการพบแพทย์",
        self: "ตัวคุณ",
        other: "ผู้อื่น",

        prefix: "คำนำหน้า",
        mr: "นาย",
        mrs: "นาง",
        ms: "นางสาว",

        firstname: "ชื่อ",
        lastname: "นามสกุล",
        dob: "วัน เดือน ปี เกิด",
        gender: "เพศ",
        male: "ชาย",
        female: "หญิง",

        phone: "เบอร์โทรศัพท์",
        email: "อีเมล",
        idCard: "เลขประจำตัวประชาชน / หนังสือเดินทาง",
        hn: "เลขประจำตัวผู้ป่วย (ถ้ามี)",

        symptomsHeader: "อาการ ปัญหาสุขภาพและอื่นๆ",
        uploadHeader: "+ ผลการตรวจสุขภาพ",
        uploadDesc: "ไฟล์ขนาดไม่เกิน 3 MB (.PDF/.JPG/.JPEG/.PNG)",

        back: "← ย้อนกลับ",
        next: "ถัดไป →",
      },


      // Appointment — STEP 3 (TH)

      step3: {
        header: "สรุปข้อมูล",

        doctorInfo: "ข้อมูลแพทย์และการนัดหมาย",
        patientInfo: "ข้อมูลผู้ป่วย",

        dateMain: "วันนัดหมายที่ต้องการ",
        dateBackup: "วันนัดหมายสำรอง",
        department: "แผนก",
        doctor: "แพทย์",

        name: "ชื่อ-นามสกุล",
        phone: "เบอร์โทรศัพท์",
        email: "อีเมล",
        symptoms: "อาการเบื้องต้น",

        viewMedic: "+ ผลการตรวจสุขภาพ",

        confirmMsg: "คุณต้องการยืนยันการนัดหมายใช่หรือไม่?",
        successMsg: "ส่งคำขอนัดหมายเรียบร้อยแล้ว"
      },

      // --- History Page ---
      history: {
        title: "ประวัติการนัดหมาย",
        colName: "ชื่อผู้ป่วย",
        colDate: "วันเวลา",
        colDoctor: "แพทย์",
        colDept: "แผนก",
        colStatus: "สถานะ",
        colSymptom: "อาการ",
        empty: "ไม่พบประวัติการนัดหมาย",
        viewMedical: "ผลการตรวจสุขภาพ",
        ReasonForDeclining: "เหตุผลที่ปฏิเสธ",
        status: {
          pending: "รอการอนุมัติ",
          confirmed: "อนุมัติแล้ว",
          cancelled: "ยกเลิก",
          sent_to_hospital: "ส่งข้อมูลไปโรงพยาบาลแล้ว",
        }

      },

      bell: {
        todayPatient: "📅 นัดของคุณวันนี้",
        todayDoctor: "🩺 คนไข้ที่ต้องตรวจ",
        noAppointment: "ไม่มีนัดวันนี้",
        doctor: "หมอ",
        time: "เวลา",
      },
      addDoctor: {
        title: "เพิ่มแพทย์ใหม่",
        thaiSection: "ข้อมูลภาษาไทย",
        engSection: "ข้อมูลภาษาอังกฤษ",

        firstnameTH: "ชื่อ (TH)",
        lastnameTH: "นามสกุล (TH)",
        firstnameEN: "ชื่อ (EN)",
        lastnameEN: "นามสกุล (EN)",

        idCard: "เลขบัตรประชาชน",
        dob: "วันเดือนปีเกิด",
        gender: "เพศ",
        genderMale: "ชาย",
        genderFemale: "หญิง",
        genderOther: "อื่นๆ",

        department: "แผนก (ค้นหา/พิมพ์เลือกได้)",
        email: "อีเมล (ใช้ในการติดต่อ)",
        phone: "เบอร์โทรศัพท์",

        workdays: "วันออกตรวจ",  

        submit: "เพิ่มแพทย์",
        saving: "กำลังบันทึก...",
        success: "เพิ่มข้อมูลแพทย์เรียบร้อยแล้ว",
        required: "กรุณากรอกข้อมูลให้ครบทุกช่อง และเลือกแผนก",
      },
      weekdays: {
        monday: "วันจันทร์",
        tuesday: "วันอังคาร",
        wednesday: "วันพุธ",
        thursday: "วันพฤหัสบดี",
        friday: "วันศุกร์",
        saturday: "วันเสาร์",
        sunday: "วันอาทิตย์"
      }


    },

    EN: {
      // --- Navbar ---
      navbar: {
        admin: [
          { name: "Home", path: "/home" },
          { name: "Search", path: "/search?query=" },
        ],
        patient: [
          { name: "Home", path: "/home" },
          { name: "Appointment", path: "/appointment" },
          { name: "History", path: "/history" },
          { name: "Search", path: "/search?query=" },
        ]
      },

      // --- Login & Register ---
      login: {
        title: "Login",
        submit: "Login",
        noAccount: "Don't have an account?",
        registerLink: "Register",
        successTitle: "Login Successful!",
        welcome: "Welcome",
        errorTitle: "Error",
      },
      register: {
        title: "Register",
        submit: "Register",
        haveAccount: "Already have an account?",
        loginLink: "Login",
        successTitle: "Registration Successful",
        successText: "Please wait for admin approval.",
        errorText: "Unable to register",
      },

      // --- Common Form Labels ---
      form: {
        firstname: "First Name",
        firstnamePh: "Enter first name",
        lastname: "Last Name",
        lastnamePh: "Enter last name",
        email: "Email",
        emailPh: "Enter email",
        dob: "Date of Birth",
        gender: "Gender",
        selectGender: "Select gender",
        male: "Male",
        female: "Female",
        other: "Other",
        username: "Username",
        usernamePh: "Enter username",
        password: "Password",
        passwordPh: "Enter password",
      },
      ok: "OK",
      error: "Error",

      // --- Appointment (Step 1) ---
      appointment: {
        title: "Appointment",
      },
      // STEP 1 (EN)

      step1: {
        header: "Appointment Information",
        preferredDate: "Preferred Date",
        backupDate: "Backup Date",
        preferredTime: "Preferred Time",
        backupTime: "Backup Time",
        selectTime: "Select Time",
        hospital: "Hospital",
        department: "Department",
        doctor: "Doctor",

        auto: "Select Automatically",
        manual: "Choose Doctor Manually",

        selectMainDate: "Please select a preferred date",
        selectHospital: "Please select a hospital",
        selectDepartment: "Please select a department",

        next: "Next →"
      },


      // STEP 2 (EN)

      step2: {
        header: "Person Seeing the Doctor",
        self: "Yourself",
        other: "Someone Else",

        prefix: "Prefix",
        mr: "Mr.",
        mrs: "Mrs.",
        ms: "Ms.",

        firstname: "First Name",
        lastname: "Last Name",
        dob: "Date of Birth",
        gender: "Gender",
        male: "Male",
        female: "Female",

        phone: "Phone Number",
        email: "Email",
        idCard: "ID Card / Passport No.",
        hn: "Hospital Number (HN) (If any)",

        symptomsHeader: "Symptoms, Health Issues, etc.",
        uploadHeader: "+ Medical Checkup Results",
        uploadDesc: "File size not exceeding 3 MB (.PDF/.JPG/.JPEG/.PNG)",

        back: "← Back",
        next: "Next →"
      },

      // STEP 3 (EN)

      step3: {
        header: "Summary",

        doctorInfo: "Doctor & Appointment Information",
        patientInfo: "Patient Information",

        dateMain: "Preferred Date",
        dateBackup: "Backup Date",
        department: "Department",
        doctor: "Doctor",

        name: "Full Name",
        phone: "Phone Number",
        email: "Email",
        symptoms: "Symptoms",

        viewMedic: "+ Medical Checkup Results",

        confirmMsg: "Do you want to confirm this appointment?",
        successMsg: "Appointment request submitted successfully!"
      },

      // --- History Page ---
      history: {
        title: "Appointment History",
        colName: "Patient Name",
        colDate: "Date & Time",
        colDoctor: "Doctor",
        colDept: "Department",
        colStatus: "Status",
        colSymptom: "Symptom",
        empty: "No appointment history found",
        viewMedical: "View Medical",
        ReasonForDeclining: "Reason for declining",
        status: {
          pending: "Pending",
          confirmed: "Confirmed",
          cancelled: "Cancelled",
          completed: "Completed",
          sent_to_hospital: "Sent to hospital",
        }

      },

      bell: {
        todayPatient: "📅 Your Appointments Today",
        todayDoctor: "🩺 Patients to Check",
        noAppointment: "No appointments today",
        doctor: "Doctor",
        time: "Time",
      },
      addDoctor: {
        title: "Add New Doctor",
        thaiSection: "Thai Information",
        engSection: "English Information",

        firstnameTH: "First Name (TH)",
        lastnameTH: "Last Name (TH)",
        firstnameEN: "First Name (EN)",
        lastnameEN: "Last Name (EN)",

        idCard: "ID Card / Personal ID",
        dob: "Date of Birth",
        gender: "Gender",
        genderMale: "Male",
        genderFemale: "Female",
        genderOther: "Other",

        department: "Department (Searchable / Typable)",
        email: "Email (Contact use)",
        phone: "Phone Number",

        workdays: "Workdays", 

        submit: "Add Doctor",
        saving: "Saving...",
        success: "Doctor information saved successfully",
        required: "Please fill in all fields and select a department",
      },
      weekdays: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
      }

    },
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, text }}>
      {children}
    </LanguageContext.Provider>
  );
};