import { useContext, useRef, useState } from "react";
import "./PromotionCarousel.css";

import A from "/img/promotion/A.jpg"
import B from "/img/promotion/B.jpg"
import C from "/img/promotion/C.jpg"
import D from "/img/promotion/D.png"
import E from "/img/promotion/E.png"
import F from "/img/promotion/F.png"
import { LanguageContext } from "./LanguageContext";

const PromotionCarousel = () => {
  const {language,text} = useContext(LanguageContext)

  const sliderRef = useRef(null);

  const [selectedPromo, setSelectedPromo] = useState(null);

  const slideLeft = () => {
    sliderRef.current.scrollLeft -= 350;
  };

  const slideRight = () => {
    sliderRef.current.scrollLeft += 350;
  };

  const promotionsTH = [
    { id: 1, image: A, title: "โปรแกรมคัดกรองโรคหลอดเลือดสมองเชิงลึก", price: "15,300฿ – 28,900฿", desc: "ตรวจคัดกรองความเสี่ยงโรคหลอดเลือดสมองแบบครบชุด รวมตรวจหัวใจ ปอด เส้นเลือดที่คอ MRI/MRA สมอง ตรวจเลือด ไขมัน ตับ ไต น้ำตาล และประเมินโดยแพทย์เฉพาะทางด้านสมอง" },
    { id: 2, image: B, title: "แพ็กเกจผ่าตัดริดสีดวงทวาร", price: "95,000฿ – 139,000฿", desc: "ราคา 95,000 บาทพักรักษาในโรงพยาบาล 2 คืน 3 วันแพ็กเกจผ่าตัดริดสีดวงทวารด้วยเครื่อง Ligasure(ตัดริดสีดวงออกพร้อมปิดแผลได้ในครั้งเดียว)ราคา 139,000 บาทพักรักษาในโรงพยาบาล 2 คืน 3 วัน" },
    { id: 3, image: C, title: "แพ็กเกจวัคซีน สำหรับเด็กและผู้ใหญ่", price: "990฿ – 12,000฿", desc: "ผู้ใหญ่ช่วงวัย 15–26 ปีHPV (ป้องกันมะเร็งปากมดลูก) เริ่ม 11,000–23,000 บาท /คอร์ส (ขึ้นกับจำนวนสายพันธุ์)ตับอักเสบบี 3 เข็มไข้หวัดใหญ่ 990 บาท/เข็งูสวัดงูสวัดชนิดเชื้อเป็นอ่อนฤทธิ์ 4,600 บาท/เข็มไข้เลือดออก 4,500 บาท/2 เข็มผู้ใหญ่ช่วงวัย 27–60 ปีวัคซีนเหมือนกลุ่ม 15–26 ปี และเพิ่มวัคซีนปอดอักเสบ 4,500 บาท/2 เข็มแนะนำฉีดไข้หวัดใหญ่ทุกปีผู้สูงอายุ 60 ปีขึ้นไปไข้หวัดใหญ่ 990 บาท/เข็มปอดอักเสบ (PPSV23, PCV13, PCV15) 2,700–3,600 บาทงูสวัด 12,000 บาท/2 เข็ม" },
    { id: 4, image: D, title: "วัคซีนไข้หวัดใหญ่ 4 สายพันธุ์ สำหรับเด็กและผู้ใหญ่", price: "700฿ – 990฿", desc: "ทำไมถึงแนะนำให้ฉีดวัคซีนไข้หวัดใหญ่ทุกปี?เชื้อไข้หวัดมีการเปลี่ยนสายพันธุ์ทุกปี ทำให้ภูมิคุ้มกันเดิมป้องกันไม่ครบทุกสายพันธุ์จึงควรฉีดกระตุ้นทุกปีเพื่อให้มีประสิทธิภาพในการสร้างภูมิคุ้มกันสูงสุด" },
    { id: 5, image: E, title: "วัคซีนป้องกันโควิด-19", price: "2,800฿", desc: "โควิด-19 ยังไม่หายไปและเชื้อยังคงมีการ กลายพันธุ์อย่างต่อเนื่อเพื่อให้มีภูมิคุ้มกันที่เพียงพอและทันต่อสายพันธุ์ล่าสุดจึงแนะนำให้ฉีด วัคซีนโควิด-19 รุ่นใหม่เพื่อสร้างภูมิคุ้มกันต่อสายพันธุ์ที่ระบาดในปัจจุบัน" },
    { id: 6, image: F, title: "VITAMIN DRIP ดริปวิตามิน", price: "2,500฿", desc: "เป็นการให้วิตามินเข้าสู่ร่างกาย โดยตรงผ่านสายน้ำเกลือเข้าทางหลอดเลือดดำ ทำให้ร่างกายดูดซึมวิตามินต่างๆ ได้อย่างรวดเร็ว" }, 
  ];
  const promotionsEN =[
    { id: 1, image: A, title: "In-depth stroke screening program", price: "15,300฿ – 28,900฿", desc: "Complete stroke risk screening, including heart, lung, neck blood vessel examination, MRI/MRA of the brain, blood test for lipids, liver, kidneys, sugar, and assessment by a brain specialist." },
    { id: 2, image: B, title: "Hemorrhoid surgery package", price: "95,000฿ – 139,000฿", desc: "Price 95,000 baht, hospital stay 2 nights 3 days, hemorrhoid surgery package with Ligasure machine (hemorrhoid removal and wound closure in one go), price 139,000 baht, hospital stay 2 nights 3 days." },
    { id: 3, image: C, title: "Vaccine packages for children and adults", price: "990฿ – 12,000฿", desc: "Adults (Ages 15–26)Stay protected with essential vaccines recommended for young adults.HPV Vaccine (Prevents cervical cancer)Starting from 11,000–23,000 THB per cours(Price varies by number of strains)Hepatitis B Vaccine — 3 dosesInfluenza Vaccine — 990 THB per doseShingles Vaccine (Live attenuated) — 4,600 THB per doseDengue Vaccine — 4,500 THB for 2 dosesAdults (Ages 27–60)Comprehensive protection for long-term health.All vaccines recommended for ages 15–26, plus:Pneumococcal Vaccine — 4,500 THB for 2 dosesAnnual influenza vaccination is strongly recommendedSeniors (Ages 60 and Above)Boost immunity and prevent severe infections.Influenza Vaccine — 990 THB per dosePneumococcal VaccinesPPSV23, PCV13, PCV15" },
    { id: 4, image: D, title: "Quadrivalent influenza vaccine for children and adults", price: "700฿ – 990฿", desc: "Why is it recommended to get a flu vaccine every year? Flu strains change every year, so your initial immunity doesn't protect you from all strains. Therefore, you should get a booster shot every year to maximize your immunity." },
    { id: 5, image: E, title: "COVID-19 vaccine", price: "2,800฿", desc: "COVID-19 has not disappeared and the virus continues to mutate. To provide sufficient immunity against the latest strains, it is recommended to get a new COVID-19 vaccine to build immunity against the currently circulating strains." },
    { id: 6, image: F, title: "VITAMIN DRIP", price: "2,500฿", desc: "It is a method of giving vitamins directly into the body through an intravenous saline solution, allowing the body to absorb various vitamins quickly." }, 
  ];

    const promotions = language === "TH" ? promotionsTH : promotionsEN

  return (
    <div className="promo-wrapper">
      {/* ปุ่มซ้าย */}
      <button className="promo-arrow left" onClick={slideLeft}>
        &#10094;
      </button>

      {/* Slide list */}
      <div className="promo-slider" ref={sliderRef}>
        {promotions.map((promo) => (
          <div className="promo-card" key={promo.id}>
            <img src={promo.image} alt={promo.title} />

            <div className="promo-info">

              <h4 className="title">{promo.title}</h4>

              <p className="price">{promo.price}</p>

              <button className="add-btn" onClick={() => setSelectedPromo(promo)}>
                {language === "TH" ? "เพิ่มเติม":"More"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มขวา */}
      <button className="promo-arrow right" onClick={slideRight}>
        &#10095;
      </button>

      {/* Modal Component */}
      {selectedPromo && (
        <div className="promo-modal-overlay" onClick={() => setSelectedPromo(null)}>
          <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPromo(null)}>×</button>

            <img src={selectedPromo.image} alt={selectedPromo.title} />
            <h2>{selectedPromo.title}</h2>
            <p className="price">{selectedPromo.price}</p>

            <p className="description">{selectedPromo.desc}</p>

          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionCarousel;