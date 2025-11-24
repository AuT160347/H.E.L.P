import React, { createContext, useState, useEffect } from "react";

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
          { name: "แชท", path: "/chat" },
          { name: "ข้อมูลนัดหมาย", path: "/admin-doctor" },
          { name: "ค้นหา", path: "/search?query=" },
          { name: "เพิ่มหมอ", path: "/admin-doctor-add" }


        ],
        patient: [
          { name: "หน้าแรก", path: "/home" },
          { name: "จองนัด", path: "/appointment" },
          { name: "แชท", path: "/chat" },
          { name: "ประวัติ", path: "/history" },
          { name: "ค้นหา", path: "/search?query=" }
        ],
        doctor: [
          { name: "หน้าแรก", path: "/home" },
          { name: "แชท", path: "/chat" },
          { name: "ข้อมูลนัดหมาย", path: "/doctor-admin" },
          { name: "ค้นหา", path: "/search?query=" }

        ],
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
        mainDate: "วันนัดหมายที่ต้องการ",
        backupDate: "วันนัดหมายสำรอง",
        time: "เวลา",
        selectTime: "เลือกเวลา",
        branch: "สาขา",
        doctor: "แพทย์",
        autoDoctor: "เลือกแพทย์ให้ฉัน",
        selectDoctor: "เลือกแพทย์ด้วยตัวเอง",
        next: "ถัดไป >",
        selectMainTime: "เลือกเวลานัดหมาย",
        selectBackupTime: "เลือกเวลานัดหมายสำรอง",
        department: "แผนก",
        searchDoctor: "ค้นหาแพทย์",
        recommendedDoctor: "หมอแนะนำ",
        noDoctorFound: "ไม่พบแพทย์ที่ค้นหา",
        lodeDoctor: "กำลังโหลดรายชื่อแพทย์...",
        submit: "ส่งข้อมูล",
        back: "กลับ",
      },

      // --- รายการแผนก (TH) ---
      departments: [
        "ทันตกรรมทั่วไป", "ทันตกรรม", "หู คอ จมูก", "อายุรกรรมประสาท",
        "อายุรกรรม-ประกันสังคม", "ศัลยกรรมกระดูกและข้อ", "ตา", "อายุรกรรมโรคเลือด",
        "อายุรกรรมเด็ก", "เวชศาสตร์ฟื้นฟู", "อายุรกรรมหัวใจ", "ศัลยกรรมทั่วไป",
        "ระบบประสาท", "ผิวหนัง", "ทางเดินอาหาร", "กระดูกและข้อ", "ทางเดินปัสสาวะ",
        "นิติเวช", "ฉุกเฉิน", "อายุรกรรม", "ปอด", "ศัลยกรรมกระดูก", "นรีเวช",
        "ภูมิแพ้", "จิตเวช", "จักษุ", "คลินิกหัวใจ", "Telecare", "Premium walk in",
        "เคมีบำบัด", "โรคติดเชื้อ", "โรคไต"
      ],

      stepper: {
        step1: "เริ่มต้น",
        step2: "ข้อมูลผู้ป่วย",
        step3: "สรุปข้อมูล"
      },

      // --- Appointment (Step 2) ---
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
        nationality: "สัญชาติ",
        nationThai: "ไทย",
        nationOther: "อื่นๆ",
        phone: "เบอร์โทรศัพท์",
        email: "อีเมล",
        idCard: "เลขประจำตัวประชาชน",
        hn: "เลขประจำตัวผู้ป่วย (ถ้ามี)",
        symptomsHeader: "อาการ ปัญหาสุขภาพและอื่นๆ",
        uploadHeader: "+ ผลการตรวจสุขภาพ",
        uploadDesc: "ไฟล์ขนาดไม่เกิน 3 MB (.PDF/.JPG/.JPEG/.PNG)",
        consentText: "ข้าพเจ้ายินยอมโดยสมัครใจให้คณะแพทย์ พยาบาล เจ้าหน้าที่ และ/หรือ บุคลากรอื่น ๆ ในทีมสุขภาพของโรงพยาบาล ทำการตรวจรักษา... ทั้งนี้ข้าพเจ้าได้รับทราบถึง",
        rightsLink: "คำประกาศสิทธิของผู้ป่วย",
        and: "และ",
        privacyLink: "นโยบายความเป็นส่วนตัว",
        consentEnd: "เป็นอย่างดีแล้ว",
        back: "< กลับ",
        next: "ถัดไป >"
      },

      // --- Appointment (Step 3) ---
      step3: {
        header: "สรุปข้อมูล",
        doctorInfo: "ข้อมูลแพทย์และการนัดหมาย",
        patientInfo: "บุคคลที่ต้องการพบแพทย์",
        symptomsInfo: "อาการ",
        doctor: "แพทย์",
        department: "แผนก",
        dateMain: "วันนัดหมายที่ต้องการ",
        dateBackup: "วันนัดหมายสำรอง",
        name: "ชื่อ-นามสกุล",
        phone: "เบอร์โทรศัพท์",
        email: "อีเมล",
        symptoms: "อาการเบื้องต้น",
        confirmMsg: "คุณต้องการยืนยันการนัดหมายใช่หรือไม่?",
        successMsg: "ส่งคำขอนัดหมายเรียบร้อยแล้ว",
        viewMedic: "+ ผลการตรวจสุขภาพ"

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
          completed: "เสร็จสิ้น",
          sent_to_doctor: "ส่งเรื่องให้แพทย์",
          doctor_reviewed: "แพทย์ตอบรับแล้ว",
          doctor_rejected: "แพทย์ไม่รับนัด"
        }
      },

      // --- Admin Patient ---
      adminPatient: {
        title: "จัดการข้อมูลนัดหมาย (ผู้ป่วย)",
        filterAll: "ทั้งหมด",
        filterPending: "รออนุมัติ",
        btnConfirm: "อนุมัติ",
        btnCancel: "ยกเลิก",
        btnComplete: "เสร็จสิ้น",
        confirmAction: "คุณต้องการเปลี่ยนสถานะเป็น",
        successUpdate: "อัปเดตสถานะเรียบร้อย",
      },

      // --- Admin Doctor ---
      adminDoctor: {
        title: "แอดมิน: ประสานงานแพทย์",
        tabNew: "คำขอใหม่",
        tabWaiting: "รอหมอตอบ",
        tabReplied: "หมอตอบรับแล้ว",
        btnSendToDoctor: "ส่งเรื่องให้หมอ",
        btnConfirmToPatient: "ยืนยันกับคนไข้",
        msgSent: "ส่งเรื่องให้แพทย์เรียบร้อย",
        msgConfirmed: "ยืนยันนัดหมายกับคนไข้เรียบร้อย",
        emptyNew: "ไม่มีคำขอใหม่",
        emptyWait: "ไม่มีรายการรอตรวจสอบ",
        emptyReply: "ไม่มีรายการที่ตอบรับแล้ว",
        viewMedical: "ผลการตรวจสุขภาพ"
      },

      // --- Doctor Admin ---
      doctorAdmin: {
        title: "แพทย์: ตรวจสอบนัดหมาย",
        empty: "ไม่มีรายการที่ต้องตรวจสอบ",
        btnAccept: "รับนัด",
        btnNoAcc: "ไม่รับนัด",
        msgAccepted: "ส่งข้อมูลกลับไปให้ Admin เรียบร้อย",
        patientName: "ชื่อผู้ป่วย",
        symptom: "อาการ",
        viewMedical: "ผลการตรวจสุขภาพ",
        reason: "เหตุผลที่ไม่รับนัด",
        note: "กรอกหมายเหตุ",
        SpecifyTheReason: "ระบุสาเหตุ เช่น คิวเต็ม,ไม่ตรงความเชี่ยวชาญ",
        cancel: "ยกเลิก",
        reject: "ไม่รับนัด"
      },
      chat: {
        sidebarHeader: "ห้องแชท",
        patientMode: "โหมดคนไข้",
        doctorMode: "โหมดหมอ",
        adminMode: "โหมดแอดมิน",

        tabPatientDoctor: "คุยกับแพทย์",
        tabAdmin: "คุยกับแอดมิน",
        tabPatientDoctor_AdminView: "คนไข้–หมอ",
        tabAdmin_AdminView: "แชทกับผู้ใช้",

        loadingRooms: "กำลังโหลดห้องแชท...",
        noRooms: "ยังไม่มีห้องแชทสำหรับบัญชีนี้",
        noLastMessage: "ยังไม่มีข้อความ",
        loadingAdminChats: "กำลังโหลดแชท...",
        noAdminChatsAdmin: "ยังไม่มีแชทระหว่างแอดมินกับผู้ใช้",
        noAdminChatsPatient: "ยังไม่มีแชทกับแอดมิน • พิมพ์ข้อความเพื่อเริ่มแชท",

        noMessages: "ยังไม่มีข้อความในห้องนี้",
        loadingMessages: "กำลังโหลดข้อความ...",
        selectChat: "เลือกห้องแชทจากด้านซ้ายเพื่อเริ่มสนทนา",
        selectAdminChat: "เลือกห้องแชทกับผู้ใช้จากด้านซ้าย",

        chatWithDoctor: "คุณกำลังคุยกับแพทย์",
        chatWithPatient: "คุณกำลังคุยกับคนไข้",
        adminChatBetweenAdmin: "แชทระหว่างแอดมิน ↔",
        adminChatBetweenPatient: "แชทระหว่างคุณ ↔ แอดมิน",

        adminDisplayName: "แอดมิน",
        userDisplayName: "ผู้ใช้",

        typingPlaceholder: "พิมพ์ข้อความ...",
        typingAdmin: "พิมพ์ข้อความถึงแอดมิน...",
        typingToUser: "พิมพ์ข้อความถึงผู้ใช้...",

        inputPlaceholder: "พิมพ์ข้อความ...",
        inputToAdmin: "พิมพ์ข้อความถึงแอดมิน...",
        inputToUser: "พิมพ์ข้อความถึงผู้ใช้...",

        sendingImage: "กำลังจะส่งรูป:",
        read: "• อ่านแล้ว",

        loginRequired: "กรุณาเข้าสู่ระบบก่อนใช้งานแชท",
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

        workdays: "วันออกตรวจ",   // ← เพิ่มอันนี้

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
          { name: "Chat", path: "/chat" },
          { name: "Appointment", path: "/admin-doctor" },
          { name: "Search", path: "/search?query=" },
          { name: "Add Doctor", path: "/admin-doctor-add" }
        ],
        patient: [
          { name: "Home", path: "/home" },
          { name: "Appointment", path: "/appointment" },
          { name: "Chat", path: "/chat" },
          { name: "History", path: "/history" },
          { name: "Search", path: "/search?query=" }

        ],
        doctor: [
          { name: "Home", path: "/home" },
          { name: "Chat", path: "/chat" },
          { name: "Appointment information", path: "/doctor-admin" },
          { name: "Search", path: "/search?query=" }
        ],
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
        mainDate: "Preferred Date",
        backupDate: "Backup Date",
        time: "Time",
        selectTime: "Select Time",
        branch: "Branch",
        doctor: "Doctor",
        autoDoctor: "Assign doctor for me",
        selectDoctor: "Choose doctor",
        next: "Next >",
        selectMainTime: "Select Main Time",
        selectBackupTime: "Select Backup Time",
        department: "Department",
        searchDoctor: "Search Doctor",
        recommendedDoctor: "Recommended Doctors",
        noDoctorFound: "No doctor found",
        lodeDoctor: "Loading list of doctors...",
        submit: "Submit Data",
        back: "Back",
      },

      // --- รายการแผนก (EN) ---
      departments: [
        "General Dentistry", "Dentistry", "ENT", "Neurology",
        "Internal Medicine – Social Security", "Orthopedic Surgery", "Ophthalmology",
        "Hematology", "Pediatrics", "Rehabilitation", "Cardiology", "General Surgery",
        "Neurology", "Dermatology", "Gastroenterology", "Orthopedics", "Urology",
        "Forensic Medicine", "Emergency", "Internal Medicine", "Pulmonology",
        "Orthopedic Surgery", "Gynecology", "Allergy", "Psychiatry", "Ophthalmology Clinic",
        "Cardiology Clinic", "Telecare Social Security", "Premium walk in",
        "Chemotherapy", "Infectious Disease", "Nephrology"
      ],

      stepper: {
        step1: "Get Started",
        step2: "Patient Information",
        step3: "Summary"
      },

      // --- Appointment (Step 2) ---
      step2: {
        header: "Person seeing the doctor",
        self: "Yourself",
        other: "Someone else",
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
        nationality: "Nationality",
        nationThai: "Thai",
        nationOther: "Other",
        phone: "Phone Number",
        email: "Email",
        idCard: "ID Card / Passport No.",
        hn: "Hospital Number (HN) (If any)",
        symptomsHeader: "Symptoms, Health Issues, etc.",
        uploadHeader: "+ Medical Checkup Results",
        uploadDesc: "File size not exceeding 3 MB (.PDF/.JPG/.JPEG/.PNG)",
        consentText: "I voluntarily consent to the medical team performing examination and treatment. I acknowledge the",
        rightsLink: "Patient Rights Declaration",
        and: "and",
        privacyLink: "Privacy Policy",
        consentEnd: "very well.",
        back: "< Back",
        next: "Next >"
      },

      // --- Appointment (Step 3) ---
      step3: {
        header: "Summary",
        doctorInfo: "Doctor & Appointment Info",
        patientInfo: "Patient Information",
        symptomsInfo: "Symptoms",
        doctor: "Doctor",
        department: "Department",
        dateMain: "Preferred Date",
        dateBackup: "Backup Date",
        name: "Name",
        phone: "Phone Number",
        email: "Email",
        symptoms: "Symptoms",
        confirmMsg: "Do you want to confirm this appointment?",
        successMsg: "Appointment request submitted successfully!",
        viewMedic: "+ Medical Checkup Results"
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
          sent_to_doctor: "Sent to Doctor",
          doctor_reviewed: "Doctor Reviewed",
          doctor_rejected: "Doctor Rejected"
        }
      },

      // --- Admin Patient ---
      adminPatient: {
        title: "Patient Appointment Management",
        filterAll: "All",
        filterPending: "Pending",
        btnConfirm: "Approve",
        btnCancel: "Cancel",
        btnComplete: "Complete",
        confirmAction: "Change status to",
        successUpdate: "Status updated successfully",
      },

      // --- Admin Doctor ---
      adminDoctor: {
        title: "Admin: Doctor Coordination",
        tabNew: "New Requests",
        tabWaiting: "Waiting for Doctor",
        tabReplied: "Doctor Responded",
        btnSendToDoctor: "Send to Doctor",
        btnConfirmToPatient: "Confirm to Patient",
        msgSent: "Sent to doctor successfully",
        msgConfirmed: "Confirmed to patient successfully",
        emptyNew: "No new requests",
        emptyWait: "No pending reviews",
        emptyReply: "No responses yet",
        viewMedical: "View Medical"

      },

      // --- Doctor Admin ---
      doctorAdmin: {
        title: "Doctor: Appointment Review",
        empty: "No appointments to review",
        btnAccept: "Appointments accepted",
        btnNoAcc: "No appointments accepted",
        msgAccepted: "Sent back to Admin successfully",
        patientName: "Patient Name",
        symptom: "Symptom",
        viewMedical: "View Medical",
        reason: "Reason for not accepting an appointment",
        note: "Enter a note",
        SpecifyTheReason: "Specify the reason, such as full appointments or not matching your expertise.",
        cancel: "Cancel",
        reject: "No Appointment"
      },
      chat: {
        sidebarHeader: "Chat Rooms",
        patientMode: "Patient Mode",
        doctorMode: "Doctor Mode",
        adminMode: "Admin Mode",

        tabPatientDoctor: "Chat with Doctor",
        tabAdmin: "Chat with Admin",
        tabPatientDoctor_AdminView: "Patient–Doctor",
        tabAdmin_AdminView: "Admin Chat",

        loadingRooms: "Loading chat rooms...",
        noRooms: "No chat rooms available",
        noLastMessage: "No messages yet",
        loadingAdminChats: "Loading chats...",
        noAdminChatsAdmin: "No admin–user chats found",
        noAdminChatsPatient: "No chat with admin yet • Type a message to start",

        noMessages: "No messages in this room",
        loadingMessages: "Loading messages...",
        selectChat: "Select a chat from the left to begin",
        selectAdminChat: "Select a chat with a user from the left",

        chatWithDoctor: "You are chatting with a doctor",
        chatWithPatient: "You are chatting with a patient",
        adminChatBetweenAdmin: "Chat between Admin ↔",
        adminChatBetweenPatient: "Chat between you ↔ Admin",

        adminDisplayName: "Admin",
        userDisplayName: "User",

        typingPlaceholder: "Type a message...",
        typingAdmin: "Type a message to Admin...",
        typingToUser: "Type a message to User...",

        inputPlaceholder: "Type a message...",
        inputToAdmin: "Type a message to Admin...",
        inputToUser: "Type a message to User...",

        sendingImage: "Sending image:",
        read: "• Read",

        loginRequired: "Please login before using chat",
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

        workdays: "Workdays",  // ← เพิ่มอันนี้

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