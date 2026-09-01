import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

import "./Achievements.css";


function Achievements() {

  // =====================================================
  // ACADEMIC EXCELLENCE POPUP
  // =====================================================

  const [showAcademic, setShowAcademic] =
    useState(false);

  const [selectedStream, setSelectedStream] =
    useState(null);


  // =====================================================
  // STUDENT ACHIEVEMENT POPUP
  // =====================================================

  const [selectedAchievement, setSelectedAchievement] =
    useState(null);

  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0);


  // =====================================================
  // FIREBASE DATA
  // =====================================================

  const [achievements, setAchievements] =
    useState([]);


  // IMPORTANT:
  // Science and Commerce are ARRAYS
  // because multiple students can be added.

  const [academicData, setAcademicData] =
    useState({

      science: [],

      commerce: [],

    });


  // =====================================================
  // LOADING
  // =====================================================

  const [loadingAchievements, setLoadingAchievements] =
    useState(true);

  const [loadingAcademic, setLoadingAcademic] =
    useState(true);


  // =====================================================
  // LOAD STUDENT ACHIEVEMENTS
  // =====================================================

  const loadAchievements = async () => {

    try {

      setLoadingAchievements(true);


      const achievementsRef =
        collection(
          db,
          "achievements"
        );


      let snapshot;


      // -------------------------------------------------
      // TRY ORDERED DATA
      // -------------------------------------------------

      try {

        const achievementsQuery =
          query(
            achievementsRef,
            orderBy(
              "order",
              "asc"
            )
          );


        snapshot =
          await getDocs(
            achievementsQuery
          );

      } catch (error) {

        console.warn(
          "Order field not found. Loading normally."
        );


        snapshot =
          await getDocs(
            achievementsRef
          );

      }


      // -------------------------------------------------
      // CONVERT FIRESTORE DATA
      // -------------------------------------------------

      const data =
        snapshot.docs.map(
          (item) => {

            const itemData =
              item.data();


            return {

              id:
                item.id,

              ...itemData,


              title:
                itemData.title ||
                itemData.name ||
                "Achievement",


              description:
                itemData.description ||
                "",


              images:
                Array.isArray(
                  itemData.images
                )
                  ? itemData.images
                  : [],

            };

          }
        );


      console.log(
        "STUDENT ACHIEVEMENTS:",
        data
      );


      setAchievements(
        data
      );


    } catch (error) {

      console.error(
        "Error loading achievements:",
        error
      );

    } finally {

      setLoadingAchievements(
        false
      );

    }

  };


  // =====================================================
  // LOAD ALL ACADEMIC EXCELLENCE DATA
  // =====================================================

  const loadAcademicData = async () => {

    try {

      setLoadingAcademic(
        true
      );


      const academicRef =
        collection(
          db,
          "academicAchievements"
        );


      const snapshot =
        await getDocs(
          academicRef
        );


      console.log(
        "🔥 ACADEMIC DOCUMENTS FROM FIREBASE:"
      );


      snapshot.forEach(
        (document) => {

          console.log(
            document.id,
            document.data()
          );

        }
      );


      // =================================================
      // ARRAYS FOR MULTIPLE STUDENTS
      // =================================================

      const scienceData = [];

      const commerceData = [];


      // =================================================
      // READ EVERY DOCUMENT
      // =================================================

      snapshot.docs.forEach(
        (item) => {

          const itemData =
            item.data();


          const stream =
            String(
              itemData.stream || ""
            )
              .trim()
              .toLowerCase();


          const studentData = {

            id:
              item.id,

            stream:
              stream,

            year:
              itemData.year || "",

            collegePercentage:
              itemData.collegePercentage ||
              "",

            topStudent:
              itemData.topStudent ||
              "",

            marks:
              itemData.marks ||
              "",

            percentage:
              itemData.percentage ||
              "",

          };


          // =================================================
          // SCIENCE
          // =================================================

          if (
            stream === "science"
          ) {

            scienceData.push(
              studentData
            );

          }


          // =================================================
          // COMMERCE
          // =================================================

          if (
            stream === "commerce"
          ) {

            commerceData.push(
              studentData
            );

          }

        }
      );


      // =================================================
      // SORT STUDENTS
      // =================================================

      scienceData.sort(
        (a, b) => {

          return String(
            a.year
          ).localeCompare(
            String(b.year)
          );

        }
      );


      commerceData.sort(
        (a, b) => {

          return String(
            a.year
          ).localeCompare(
            String(b.year)
          );

        }
      );


      // =================================================
      // FINAL DATA
      // =================================================

      const finalData = {

        science:
          scienceData,

        commerce:
          commerceData,

      };


      console.log(
        "🔥 FINAL ACADEMIC DATA:",
        finalData
      );


      setAcademicData(
        finalData
      );


    } catch (error) {

      console.error(
        "Error loading academic data:",
        error
      );

    } finally {

      setLoadingAcademic(
        false
      );

    }

  };


  // =====================================================
  // LOAD FIREBASE DATA
  // =====================================================

  useEffect(() => {

    loadAchievements();

    loadAcademicData();

  }, []);


  // =====================================================
  // OPEN STUDENT ACHIEVEMENT
  // =====================================================

  const openAchievement = (
    achievement
  ) => {

    setSelectedAchievement(
      achievement
    );

    setSelectedImageIndex(
      0
    );

  };


  // =====================================================
  // CLOSE STUDENT ACHIEVEMENT
  // =====================================================

  const closeAchievement = () => {

    setSelectedAchievement(
      null
    );

    setSelectedImageIndex(
      0
    );

  };


  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const showPreviousImage = () => {

    if (
      !selectedAchievement
    ) {

      return;

    }


    const images =
      selectedAchievement.images ||
      [];


    if (
      images.length <= 1
    ) {

      return;

    }


    setSelectedImageIndex(
      (current) => {

        if (
          current === 0
        ) {

          return (
            images.length - 1
          );

        }


        return current - 1;

      }
    );

  };


  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const showNextImage = () => {

    if (
      !selectedAchievement
    ) {

      return;

    }


    const images =
      selectedAchievement.images ||
      [];


    if (
      images.length <= 1
    ) {

      return;

    }


    setSelectedImageIndex(
      (current) => {

        if (
          current ===
          images.length - 1
        ) {

          return 0;

        }


        return current + 1;

      }
    );

  };


  // =====================================================
  // KEYBOARD CONTROLS
  // =====================================================

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          !selectedAchievement
        ) {

          return;

        }


        if (
          event.key ===
          "ArrowLeft"
        ) {

          showPreviousImage();

        }


        if (
          event.key ===
          "ArrowRight"
        ) {

          showNextImage();

        }


        if (
          event.key ===
          "Escape"
        ) {

          closeAchievement();

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [selectedAchievement]);


  // =====================================================
  // CURRENT ACHIEVEMENT IMAGE
  // =====================================================

  const currentImages =
    selectedAchievement?.images ||
    [];


  const currentImage =
    currentImages.length > 0
      ? currentImages[
          selectedImageIndex
        ]
      : null;


  // =====================================================
  // SELECTED ACADEMIC STUDENTS
  // =====================================================

  const selectedAcademicStudents =
    selectedStream
      ? academicData[
          selectedStream
        ] || []
      : [];


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section
      id="achievements"
      className="achievements"
    >

      <div className="achievements-container">


        {/* =================================================
            MAIN HEADING
        ================================================= */}

        <div className="achievements-heading">

          <p className="achievements-small-title">
            OUR ACHIEVEMENTS
          </p>


          <h2>
            Celebrating{" "}
            <span>
              Excellence
            </span>
          </h2>


          <p>
            Discover the academic excellence
            and achievements of our students.
          </p>

        </div>



        {/* =================================================
            ACADEMIC EXCELLENCE CARD
        ================================================= */}

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
              performance of our Science and
              Commerce students.
            </p>


            <button
              className="academic-button"
              onClick={() => {

                setShowAcademic(
                  true
                );

                setSelectedStream(
                  null
                );

              }}
            >
              View Academic Excellence
            </button>

          </div>

        </div>



        {/* =================================================
            STUDENT ACHIEVEMENTS HEADING
        ================================================= */}

        <div className="other-achievements-heading">

          <p className="other-small-title">
            STUDENT ACHIEVEMENTS
          </p>


          <h3>
            Celebrating{" "}
            <span>
              Excellence
            </span>
          </h3>


          <p>
            Celebrating the achievements and
            accomplishments of our students.
          </p>

        </div>



        {/* =================================================
            LOADING
        ================================================= */}

        {loadingAchievements && (

          <div className="achievements-empty">

            <div className="achievements-empty-icon">
              ⏳
            </div>


            <h4>
              Loading Achievements...
            </h4>

          </div>

        )}



        {/* =================================================
            STUDENT ACHIEVEMENT CARDS
        ================================================= */}

        {!loadingAchievements &&
        achievements.length > 0 && (

          <div className="achievements-grid">

            {achievements.map(
              (achievement) => (

                <div
                  className="achievement-card"
                  key={
                    achievement.id
                  }
                  onClick={() =>
                    openAchievement(
                      achievement
                    )
                  }
                >

                  <div className="achievement-card-image">

                    {achievement.images &&
                    achievement.images.length >
                      0 ? (

                      <img
                        src={
                          achievement.images[0]
                        }
                        alt={
                          achievement.title
                        }
                      />

                    ) : (

                      <div className="achievement-image-placeholder">
                        🏅
                      </div>

                    )}

                  </div>


                  <div className="achievement-card-content">

                    <h4>
                      {
                        achievement.title
                      }
                    </h4>


                    <span>
                      View Details →
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}



        {/* =================================================
            NO STUDENT ACHIEVEMENTS
        ================================================= */}

        {!loadingAchievements &&
        achievements.length === 0 && (

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



      {/* =====================================================
          ACADEMIC EXCELLENCE POPUP
      ===================================================== */}

      {showAcademic && (

        <div
          className="achievement-modal-overlay"
          onClick={() => {

            setShowAcademic(
              false
            );

            setSelectedStream(
              null
            );

          }}
        >

          <div
            className="achievement-modal academic-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              className="achievement-close"
              onClick={() => {

                setShowAcademic(
                  false
                );

                setSelectedStream(
                  null
                );

              }}
            >
              ×
            </button>



            {/* =================================================
                HEADING
            ================================================= */}

            <div className="academic-modal-heading">

              <p>
                ACADEMIC ACHIEVEMENT
              </p>


              <h2>
                Academic Excellence
              </h2>

            </div>



            {/* =================================================
                SCIENCE / COMMERCE
            ================================================= */}

            {!selectedStream && (

              <div className="stream-selection">

                <button
                  className="stream-button"
                  onClick={() =>
                    setSelectedStream(
                      "science"
                    )
                  }
                >
                  Science
                </button>


                <button
                  className="stream-button"
                  onClick={() =>
                    setSelectedStream(
                      "commerce"
                    )
                  }
                >
                  Commerce
                </button>

              </div>

            )}



            {/* =================================================
                SELECTED STREAM
            ================================================= */}

            {selectedStream && (

              <div className="academic-details">


                {/* BACK */}

                <button
                  className="back-button"
                  onClick={() =>
                    setSelectedStream(
                      null
                    )
                  }
                >
                  ← Back
                </button>


                {/* STREAM TITLE */}

                <h3>
                  {selectedStream ===
                  "science"
                    ? "Science"
                    : "Commerce"}
                </h3>



                {/* =================================================
                    LOADING
                ================================================= */}

                {loadingAcademic && (

                  <p className="academic-loading">
                    Loading academic data...
                  </p>

                )}



                {/* =================================================
                    MULTIPLE STUDENTS TABLE
                ================================================= */}

                {!loadingAcademic &&
                selectedAcademicStudents.length >
                  0 && (

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

                        {selectedAcademicStudents.map(
                          (student) => (

                            <tr
                              key={
                                student.id
                              }
                            >

                              <td>
                                {
                                  student.year ||
                                  "-"
                                }
                              </td>


                              <td>
                                {
                                  student.collegePercentage ||
                                  "-"
                                }
                              </td>


                              <td>
                                {
                                  student.topStudent ||
                                  "-"
                                }
                              </td>


                              <td>
                                {
                                  student.marks ||
                                  "-"
                                }
                              </td>


                              <td>
                                {
                                  student.percentage ||
                                  "-"
                                }
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}



                {/* =================================================
                    NO DATA
                ================================================= */}

                {!loadingAcademic &&
                selectedAcademicStudents.length ===
                  0 && (

                  <div className="academic-not-found">

                    <p>

                      No{" "}
                      {selectedStream ===
                      "science"
                        ? "Science"
                        : "Commerce"}{" "}
                      academic data has
                      been added yet.

                    </p>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      )}



      {/* =====================================================
          STUDENT ACHIEVEMENT IMAGE POPUP
      ===================================================== */}

      {selectedAchievement && (

        <div
          className="achievement-modal-overlay"
          onClick={
            closeAchievement
          }
        >

          <div
            className="achievement-popup"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* CLOSE */}

            <button
              className="achievement-close"
              onClick={
                closeAchievement
              }
            >
              ×
            </button>



            {/* TITLE */}

            <div className="achievement-popup-title">

              <p>
                STUDENT ACHIEVEMENT
              </p>


              <h2>
                {
                  selectedAchievement.title
                }
              </h2>

            </div>



            {/* IMAGE SLIDER */}

            <div className="achievement-image-slider">

              {currentImages.length >
                1 && (

                <button
                  className="achievement-arrow achievement-arrow-left"
                  onClick={
                    showPreviousImage
                  }
                >
                  ‹
                </button>

              )}



              <div className="achievement-popup-image">

                {currentImage ? (

                  <img
                    src={
                      currentImage
                    }
                    alt={
                      selectedAchievement.title
                    }
                  />

                ) : (

                  <div className="popup-no-image">
                    No image available
                  </div>

                )}

              </div>



              {currentImages.length >
                1 && (

                <button
                  className="achievement-arrow achievement-arrow-right"
                  onClick={
                    showNextImage
                  }
                >
                  ›
                </button>

              )}

            </div>



            {/* IMAGE COUNTER */}

            {currentImages.length >
              1 && (

              <div className="achievement-image-counter">

                {selectedImageIndex + 1}
                {" / "}
                {currentImages.length}

              </div>

            )}



            {/* DESCRIPTION */}

            <div className="achievement-popup-description">

              <h3>
                About this Achievement
              </h3>


              <p>
                {
                  selectedAchievement.description ||
                  "No description available."
                }
              </p>

            </div>

          </div>

        </div>

      )}

    </section>

  );

}


export default Achievements;