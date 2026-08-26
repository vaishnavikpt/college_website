import { useState } from "react";
import "./Faculties.css";

function Faculties() {
  // Temporary data for now.
  // Later, this will come from the database.
  const faculties = [
    {
      name: "Faculty Name",
      designation: "Principal",
      qualification: "M.A., B.Ed.",
      image: "/images/faculty1.jpg",
    },
    {
      name: "Faculty Name",
      designation: "Lecturer - Physics",
      qualification: "M.Sc., B.Ed.",
      image: "/images/faculty2.jpg",
    },
    {
      name: "Faculty Name",
      designation: "Lecturer - Chemistry",
      qualification: "M.Sc., B.Ed.",
      image: "/images/faculty3.jpg",
    },
    {
      name: "Faculty Name",
      designation: "Lecturer - Mathematics",
      qualification: "M.Sc., B.Ed.",
      image: "/images/faculty4.jpg",
    },
    {
      name: "Faculty Name",
      designation: "Lecturer - Commerce",
      qualification: "M.Com., B.Ed.",
      image: "/images/faculty5.jpg",
    },
    {
      name: "Faculty Name",
      designation: "Lecturer - Computer Science",
      qualification: "MCA",
      image: "/images/faculty6.jpg",
    },
  ];

  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleFacultyClick = (index) => {
    if (selectedFaculty === index) {
      setSelectedFaculty(null);
    } else {
      setSelectedFaculty(index);
    }
  };

  return (
    <section className="faculties-section">
      <div className="faculties-container">

        {/* Heading */}
        <div className="faculties-heading">
          <span>OUR FACULTY</span>

          <h1>Meet Our Faculty</h1>

          <p>
            Our dedicated faculty members are committed to providing
            quality education and guiding students towards success.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="faculties-grid">

          {faculties.map((faculty, index) => (
            <div className="faculty-card" key={index}>

              {/* Clickable Image */}
              <div
                className="faculty-image-container"
                onClick={() => handleFacultyClick(index)}
              >
                <img
                  src={faculty.image}
                  alt={faculty.name}
                  className="faculty-image"
                />
              </div>

              {/* Name */}
              <h2>{faculty.name}</h2>

              {/* Details appear after clicking */}
              {selectedFaculty === index && (
                <div className="faculty-info">

                  <p>
                    <strong>Designation</strong>
                    <span>{faculty.designation}</span>
                  </p>

                  <p>
                    <strong>Qualification</strong>
                    <span>{faculty.qualification}</span>
                  </p>

                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Faculties;