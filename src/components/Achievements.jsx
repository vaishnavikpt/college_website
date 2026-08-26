import { useState } from "react";
import "./Achievements.css";

function Achievements() {

  const [showAcademic, setShowAcademic] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);


  /* =========================================
     ACADEMIC EXCELLENCE DATA

     LATER THIS WILL COME FROM DATABASE
  ========================================= */

  const academicData = {

    science: {
      year: "",
      collegePercentage: "",
      topStudent: "",
      marks: "",
      percentage: ""
    },

    commerce: {
      year: "",
      collegePercentage: "",
      topStudent: "",
      marks: "",
      percentage: ""
    }

  };


  /* =========================================
     OTHER STUDENT ACHIEVEMENTS

     LATER THIS WILL COME FROM DATABASE

     Each achievement can have multiple images.
  ========================================= */

  const achievements = [

    /*
    Example:

    {
      title: "State Level Sports Achievement",

      images: [
        "/images/sports1.jpg",
        "/images/sports2.jpg"
      ],

      description:
        "Our students participated in the state level
        sports competition and achieved excellent results."
    },

    */

  ];


  return (

    <section
      id="achievements"
      className="achievements"
    >

      <div className="achievements-container">


        {/* =====================================
            SECTION HEADING
        ===================================== */}

        <div className="achievements-heading">

          <p className="achievements-small-title">
            OUR ACHIEVEMENTS
          </p>

          <h2>
            Celebrating <span>Excellence</span>
          </h2>

          <p>
            Discover the academic excellence and
            achievements of our students.
          </p>

        </div>



        {/* =====================================
            ACADEMIC EXCELLENCE
        ===================================== */}

        <div className="academic-card">

          <div className="academic-icon">
            🏆
          </div>

          <div className="academic-content">

            <h3>
              Academic Excellence
            </h3>

            <p>
              Explore the outstanding academic
              performance of our Science and Commerce
              students.
            </p>

            <button
              className="academic-button"
              onClick={() => {

                setShowAcademic(true);

                setSelectedStream(null);

              }}
            >
              View Academic Excellence
            </button>

          </div>

        </div>

<br/>

        {/* =====================================
            OTHER ACHIEVEMENTS
        ===================================== */}

      <div className="other-achievements-heading">

  <p className="other-small-title">
    STUDENT ACHIEVEMENTS
  </p>

  <h3>
    Celebrating <span>Excellence</span>
  </h3>

  <p>
    Celebrating the achievements and
    accomplishments of our students.
  </p>

</div>


          {achievements.length > 0 ? (

            <div className="achievements-grid">

              {achievements.map(
                (achievement, index) => (

                  <div
                    className="achievement-card"
                    key={index}
                    onClick={() =>
                      setSelectedAchievement(achievement)
                    }
                  >

                    {/* IMAGE */}

                    <div className="achievement-card-image">

                      {achievement.images &&
                      achievement.images.length > 0 ? (

                        <img
                          src={achievement.images[0]}
                          alt={achievement.title}
                        />

                      ) : (

                        <div className="achievement-image-placeholder">
                          📷
                        </div>

                      )}

                    </div>


                    {/* TITLE */}

                    <div className="achievement-card-content">

                      <h4>
                        {achievement.title}
                      </h4>

                      <span>
                        View Details →
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="achievements-empty">

              <div className="achievements-empty-icon">
                🏅
              </div>

              <h4>
                No Achievements Added Yet
              </h4>

              <p>
                Student achievements will be
                updated soon.
              </p>

            </div>

          )}

        </div>

      



      {/* =====================================
          ACADEMIC EXCELLENCE POPUP
      ===================================== */}

      {showAcademic && (

        <div
          className="achievement-modal-overlay"
          onClick={() => {

            setShowAcademic(false);

            setSelectedStream(null);

          }}
        >

          <div
            className="achievement-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* CLOSE */}

            <button
              className="achievement-close"
              onClick={() => {

                setShowAcademic(false);

                setSelectedStream(null);

              }}
            >
              ×
            </button>



            {/* =================================
                POPUP HEADING
            ================================= */}

            <div className="academic-modal-heading">

              <p>
                ACADEMIC ACHIEVEMENT
              </p>

              <h2>
                Academic Excellence
              </h2>

            </div>



            {/* =================================
                SCIENCE / COMMERCE BUTTONS
            ================================= */}

            {!selectedStream && (

              <div className="stream-selection">

                <button
                  className="stream-button"
                  onClick={() =>
                    setSelectedStream("science")
                  }
                >
                  Science
                </button>


                <button
                  className="stream-button"
                  onClick={() =>
                    setSelectedStream("commerce")
                  }
                >
                  Commerce
                </button>

              </div>

            )}



            {/* =================================
                SELECTED STREAM
            ================================= */}

            {selectedStream && (

              <div className="academic-details">

                <button
                  className="back-button"
                  onClick={() =>
                    setSelectedStream(null)
                  }
                >
                  ← Back
                </button>


                <h3>
                  {selectedStream === "science"
                    ? "Science"
                    : "Commerce"}
                </h3>


                {/* =================================
                    ACADEMIC TABLE
                ================================= */}

                <div className="academic-table-wrapper">

                  <table className="academic-table">

                    <thead>

                      <tr>

                        <th>
                          Year
                        </th>

                        <th>
                          College Percentage
                        </th>

                        <th>
                          Top Student
                        </th>

                        <th>
                          Marks
                        </th>

                        <th>
                          Percentage
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      <tr>

                        <td>
                          {academicData[selectedStream].year ||
                            "To be updated"}
                        </td>

                        <td>
                          {academicData[selectedStream]
                            .collegePercentage ||
                            "To be updated"}
                        </td>

                        <td>
                          {academicData[selectedStream]
                            .topStudent ||
                            "To be updated"}
                        </td>

                        <td>
                          {academicData[selectedStream].marks ||
                            "To be updated"}
                        </td>

                        <td>
                          {academicData[selectedStream]
                            .percentage ||
                            "To be updated"}
                        </td>

                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>

            )}

          </div>

        </div>

      )}



      {/* =====================================
          OTHER ACHIEVEMENT POPUP
      ===================================== */}

      {selectedAchievement && (

        <div
          className="achievement-modal-overlay"
          onClick={() =>
            setSelectedAchievement(null)
          }
        >

          <div
            className="achievement-modal achievement-description-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* CLOSE */}

            <button
              className="achievement-close"
              onClick={() =>
                setSelectedAchievement(null)
              }
            >
              ×
            </button>



            {/* =================================
                IMAGE
            ================================= */}

            {selectedAchievement.images &&
            selectedAchievement.images.length > 0 && (

              <div className="achievement-main-image">

                <img
                  src={
                    selectedAchievement.images[0]
                  }
                  alt={
                    selectedAchievement.title
                  }
                />

              </div>

            )}



            {/* =================================
                TITLE + DESCRIPTION
            ================================= */}

            <div className="achievement-description">

              <h2>
                {selectedAchievement.title}
              </h2>

              <p>
                {selectedAchievement.description}
              </p>


              {/* OTHER IMAGES */}

              {selectedAchievement.images &&
              selectedAchievement.images.length > 1 && (

                <div className="achievement-popup-gallery">

                  {selectedAchievement.images
                    .slice(1)
                    .map((image, index) => (

                      <img
                        key={index}
                        src={image}
                        alt={`${selectedAchievement.title} ${
                          index + 2
                        }`}
                      />

                    ))}

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </section>

  );
}

export default Achievements;