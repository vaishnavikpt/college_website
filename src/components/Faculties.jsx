import { useState } from "react";
import "./Faculties.css";

function Faculties() {

  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const faculties = [
    {
      id: 1,
      name: "Faculty Name 1",
      image: "/src/assets/faculty1.jpg",
      designation: "Lecturer",
      qualification: "M.Sc, B.Ed"
    },
    {
      id: 2,
      name: "Faculty Name 2",
      image: "/src/assets/faculty2.jpg",
      designation: "Lecturer",
      qualification: "M.Com, B.Ed"
    },
    {
      id: 3,
      name: "Faculty Name 3",
      image: "/src/assets/faculty3.jpg",
      designation: "Lecturer",
      qualification: "M.A, B.Ed"
    }
  ];

  return (
    <section id="faculties" className="faculties-section">

      <div className="faculties-heading">
        <p>OUR TEAM</p>
        <h2>Our Faculties</h2>
        <span>
          Meet our dedicated and experienced teaching faculty
        </span>
      </div>

      <div className="faculties-container">

        {faculties.map((faculty) => (

          <div className="faculty-card" key={faculty.id}>

            <div
              className="faculty-image"
              onClick={() => setSelectedFaculty(faculty)}
            >
              <img
                src={faculty.image}
                alt={faculty.name}
              />

              <div className="faculty-overlay">
                <span>View Details</span>
              </div>
            </div>

            <div className="faculty-info">
              <h3>{faculty.name}</h3>
            </div>

          </div>

        ))}

      </div>


      {/* FACULTY POPUP */}

      {selectedFaculty && (

        <div
          className="faculty-modal"
          onClick={() => setSelectedFaculty(null)}
        >

          <div
            className="faculty-modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="faculty-close"
              onClick={() => setSelectedFaculty(null)}
            >
              ×
            </button>

            <img
              src={selectedFaculty.image}
              alt={selectedFaculty.name}
            />

            <h2>{selectedFaculty.name}</h2>

            <div className="faculty-details">

              <p>
                <strong>Designation:</strong>
                <br />
                {selectedFaculty.designation}
              </p>

              <p>
                <strong>Qualification:</strong>
                <br />
                {selectedFaculty.qualification}
              </p>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default Faculties;