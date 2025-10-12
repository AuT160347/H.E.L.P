import { useState } from "react";

import "./home.css"

const Home = ({ language }) => {
    const [message, setMessage] = useState("");

    return (
        <div>
            <div className="borderDA">
                <section className="py-5 text-center container">
                    <div className="row py-lg-5">
                        <div className="col-lg-6 col-md-8 mx-auto">
                            <h1 className="font-weight-light mb-5 text-white ">
                                {language ? "นัดจองหมอ" : "Doctor Appointment "}
                            </h1>

                            <input
                                type="text"
                                className="form-control mb-3 "
                                placeholder={
                                    language
                                        ? "พิมพ์ข้อความของคุณที่นี่..."
                                        : "Type your message here..."
                                }
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <p className="lead text-white mt-4 ">
                                {language
                                    ? "ข้อความสั้น ๆ นำเกี่ยวกับคอลเล็กชันด้านล่าง—เนื้อหา ผู้สร้าง ฯลฯ"
                                    : "Something short and leading about the collection below—its contents, the creator, etc."}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="album py-5">
                    <div className="container">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

                            {/* Card 1 */}
                            <div className="col">
                                <div className="card shadow-sm">
                                    <svg
                                        className="bd-placeholder-img card-img-top"
                                        width="100%"
                                        height="225"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-label="Placeholder: Thumbnail"
                                        preserveAspectRatio="xMidYMid slice"
                                        role="img"
                                        focusable="false"
                                    >
                                        <title>Placeholder</title>
                                        <rect width="100%" height="100%" fill="#55595c" />
                                        <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                                            Thumbnail
                                        </text>
                                    </svg>

                                    <div className="card-body">
                                        <p className="card-text">
                                            This is a wider card with supporting text below as a natural
                                            lead-in to additional content. This content is a little bit
                                            longer.
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                            <small className="text-muted">9 mins</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="col">
                                <div className="card shadow-sm">
                                    <svg
                                        className="bd-placeholder-img card-img-top"
                                        width="100%"
                                        height="225"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-label="Placeholder: Thumbnail"
                                        preserveAspectRatio="xMidYMid slice"
                                        role="img"
                                        focusable="false"
                                    >
                                        <title>Placeholder</title>
                                        <rect width="100%" height="100%" fill="#55595c" />
                                        <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                                            Thumbnail
                                        </text>
                                    </svg>

                                    <div className="card-body">
                                        <p className="card-text">
                                            This is a wider card with supporting text below as a natural
                                            lead-in to additional content. This content is a little bit
                                            longer.
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                            <small className="text-muted">9 mins</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="col">
                                <div className="card shadow-sm">
                                    <svg
                                        className="bd-placeholder-img card-img-top"
                                        width="100%"
                                        height="225"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-label="Placeholder: Thumbnail"
                                        preserveAspectRatio="xMidYMid slice"
                                        role="img"
                                        focusable="false"
                                    >
                                        <title>Placeholder</title>
                                        <rect width="100%" height="100%" fill="#55595c" />
                                        <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                                            Thumbnail
                                        </text>
                                    </svg>

                                    <div className="card-body">
                                        <p className="card-text">
                                            This is a wider card with supporting text below as a natural
                                            lead-in to additional content. This content is a little bit
                                            longer.
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                            <small className="text-muted">9 mins</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* สามารถเพิ่ม card อื่นๆ ต่อได้แบบเดียวกัน */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
