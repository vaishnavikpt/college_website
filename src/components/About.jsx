import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";
import "./About.css";
import collegeImage from "../assets/college.jpg";

function About() {
  const [showManagement, setShowManagement] =
    useState(false);

  const [managementMembers, setManagementMembers] =
    useState([]);

  const [loadingManagement, setLoadingManagement] =
    useState(false);

  // Selected member whose qualification is shown
  const [selectedMember, setSelectedMember] =
    useState(null);


  // ==========================================
  // FETCH MANAGEMENT MEMBERS
  // ==========================================

  const fetchManagementMembers = async () => {
    setLoadingManagement(true);

    try {
      const snapshot = await getDocs(
        collection(db, "management")
      );

      const members = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .sort(
          (a, b) =>
            (Number(a.order) || 0) -
            (Number(b.order) || 0)
        );

      setManagementMembers(members);

    } catch (error) {
      console.error(
        "Error fetching management members:",
        error
      );

    } finally {
      setLoadingManagement(false);
    }
  };


  // ==========================================
  // OPEN MANAGEMENT
  // ==========================================

  const openManagement = () => {
    setShowManagement(true);
    setSelectedMember(null);
    fetchManagementMembers();
  };


  // ==========================================
  // CLOSE MANAGEMENT
  // ==========================================

  const closeManagement = () => {
    setShowManagement(false);
    setSelectedMember(null);
  };


  // ==========================================
  // RETURN
  // ==========================================

  return (
    <>
      {/* =========================
          ABOUT SECTION
      ========================= */}

      <section
        id="about"
        className="about"
      >

        <div className="about-container">

          <div className="about-image">

            <img
              src={collegeImage}
              alt="Shree Narayana Guru Composite PU College"
            />

          </div>


          <div className="about-content">

            <p className="about-small-title">
              ABOUT OUR COLLEGE
            </p>

            <h2>
              Shree Narayana Guru
              <span>
                {" "}Composite PU College
              </span>
            </h2>

            <p>
              Shree Narayana Guru Composite PU College,
              Mulki, is committed to providing quality
              education and creating a strong foundation
              for students to achieve their academic and
              personal goals.
            </p>

            <p>
              Our college focuses on academic excellence,
              discipline, character development and the
              overall growth of every student. We believe
              in creating an environment where students
              can learn, explore their potential and
              prepare confidently for their future.
            </p>


            {/* HIGHLIGHTS */}

            <div className="about-highlights">

              <div>
                <h3>Quality</h3>
                <p>Education</p>
              </div>

              <div>
                <h3>Values</h3>
                <p>And Discipline</p>
              </div>

              <div>
                <h3>Future</h3>
                <p>Focused Learning</p>
              </div>

            </div>


            {/* KNOW MORE */}

            <button
              className="know-more-button"
              onClick={openManagement}
            >
              Know More
            </button>

          </div>

        </div>

      </section>


      {/* =========================
          MANAGEMENT POPUP
      ========================= */}

      {showManagement && (

        <div className="management-overlay">

          <div className="management-popup">

            {/* CLOSE BUTTON */}

            <button
              className="management-close"
              onClick={closeManagement}
            >
              ×
            </button>


            {/* HEADING */}

            <div className="management-heading">

              <p className="management-small-title">
                MANAGEMENT & ADMINISTRATION
              </p>

              <h2>
                Our <span>Leadership</span>
              </h2>

              <p>
                Meet the people who guide and support
                our institution.
              </p>

            </div>


            {/* =========================
                LOADING
            ========================= */}

            {loadingManagement ? (

              <div className="management-loading">
                Loading management...
              </div>

            ) : managementMembers.length === 0 ? (

              <div className="management-empty">
                No management members available.
              </div>

            ) : (

              <div className="management-grid">

                {managementMembers.map(
                  (member) => (

                    <div
                      className={`management-card ${
                        selectedMember?.id === member.id
                          ? "selected"
                          : ""
                      }`}
                      key={member.id}
                    >

                      {/* =====================
                          IMAGE
                      ====================== */}

                      <div
                        className="management-image clickable"
                        onClick={() =>
                          setSelectedMember(member)
                        }
                      >

                        {member.image ? (

                          <img
                            src={member.image}
                            alt={member.name}
                          />

                        ) : (

                          <div className="person-placeholder">
                            👤
                          </div>

                        )}

                      </div>


                      {/* =====================
                          NAME
                      ====================== */}

                      <div className="management-info">

                        <h3>
                          {member.name}
                        </h3>

                        <h4>
                          {member.designation}
                        </h4>


                        {/* QUALIFICATION
                            APPEARS WHEN IMAGE
                            IS CLICKED */}

                        {selectedMember?.id ===
                          member.id && (

                          <div className="management-qualification">

                            <span>
                              Qualification
                            </span>

                            <p>
                              {member.qualification ||
                                "Not provided"}
                            </p>

                          </div>

                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </>
  );
}

export default About;