import { useState } from "react";
import "./About.css";
import collegeImage from "../assets/college.jpg";

function About() {
  const [showManagement, setShowManagement] = useState(false);

  const managementMembers = [
    {
      name: "Principal Name",
      designation: "Principal",
      description:
        "Information about the Principal will be added here later.",
    },
    {
      name: "Correspondent Name",
      designation: "Correspondent",
      description:
        "Information about the Correspondent will be added here later.",
    },
    {
      name: "Administrator Name",
      designation: "Administrator",
      description:
        "Information about the Administrator will be added here later.",
    },
  ];

  return (
    <>
      {/* =========================
          ABOUT SECTION
      ========================= */}

      <section id="about" className="about">
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
              <span> Composite PU College</span>
            </h2>

            <p>
              Shree Narayana Guru Composite PU College, Mulki, is committed
              to providing quality education and creating a strong foundation
              for students to achieve their academic and personal goals.
            </p>

            <p>
              Our college focuses on academic excellence, discipline,
              character development and the overall growth of every student.
              We believe in creating an environment where students can learn,
              explore their potential and prepare confidently for their future.
            </p>

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

            {/* KNOW MORE BUTTON */}

            <button
              className="know-more-button"
              onClick={() => setShowManagement(true)}
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
              onClick={() => setShowManagement(false)}
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
                Meet the people who guide and support the growth,
                development and administration of our institution.
              </p>

            </div>


            {/* MANAGEMENT MEMBERS */}

            <div className="management-grid">

              {managementMembers.map((member, index) => (

                <div
                  className="management-card"
                  key={index}
                >

                  <div className="management-image">

                    <div className="person-placeholder">
                      👤
                    </div>

                  </div>

                  <div className="management-info">

                    <h3>
                      {member.name}
                    </h3>

                    <h4>
                      {member.designation}
                    </h4>

                    <p>
                      {member.description}
                    </p>

                  </div>

                </div>

              ))}

            </div>


            {/* MANAGEMENT INFORMATION */}

            <div className="management-note">

              <h3>
                About the Management
              </h3>

              <p>
                Information about the management and governing body
                of Shree Narayana Guru Composite PU College will be
                displayed here. This information can be updated
                through the administration system in the future.
              </p>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default About;