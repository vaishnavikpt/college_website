import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import "./Faculties.css";


function Faculties() {

  // =====================================================
  // FACULTY DATA
  // =====================================================

  const [faculties, setFaculties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedFaculty, setSelectedFaculty] =
    useState(null);


  // =====================================================
  // FETCH FACULTIES
  // =====================================================

  useEffect(() => {

    const loadFaculties = async () => {

      try {

        setLoading(true);


        // =================================================
        // GET FACULTIES COLLECTION
        // =================================================

        const facultiesRef =
          collection(db, "faculties");

        const snapshot =
          await getDocs(facultiesRef);


        const facultyData =
          snapshot.docs.map((item) => {

            const data = item.data();

            return {

              id: item.id,

              name: data.name || "",

              designation:
                data.designation || "",

              qualification:
                data.qualification || "",

              image:
                data.image || "",

            };

          });


        console.log(
          "🔥 FACULTIES FROM FIREBASE:",
          facultyData
        );


        // =================================================
        // GET SAVED FACULTY ORDER
        // =================================================

        let finalFaculties =
          [...facultyData];


        try {

          const orderRef =
            doc(
              db,
              "facultySettings",
              "order"
            );


          const orderSnapshot =
            await getDoc(orderRef);


          if (orderSnapshot.exists()) {

            const savedOrder =
              orderSnapshot.data().ids || [];


            console.log(
              "🔥 SAVED FACULTY ORDER:",
              savedOrder
            );


            // =============================================
            // ARRANGE ACCORDING TO ADMIN ORDER
            // =============================================

            const orderedFaculties = [];


            savedOrder.forEach((id) => {

              const faculty =
                facultyData.find(
                  (item) =>
                    item.id === id
                );


              if (faculty) {

                orderedFaculties.push(
                  faculty
                );

              }

            });


            // =============================================
            // ADD NEW FACULTIES
            // =============================================

            facultyData.forEach(
              (faculty) => {

                const alreadyAdded =
                  orderedFaculties.some(
                    (item) =>
                      item.id === faculty.id
                  );


                if (!alreadyAdded) {

                  orderedFaculties.push(
                    faculty
                  );

                }

              }
            );


            finalFaculties =
              orderedFaculties;

          }

        } catch (orderError) {

          console.warn(
            "Faculty order could not be loaded:",
            orderError
          );

          // Keep normal Firestore order
          finalFaculties =
            [...facultyData];

        }


        console.log(
          "🔥 FINAL FACULTIES:",
          finalFaculties
        );


        setFaculties(
          finalFaculties
        );


      } catch (error) {

        console.error(
          "❌ Error fetching faculties:",
          error
        );

        setFaculties([]);

      } finally {

        setLoading(false);

      }

    };


    loadFaculties();

  }, []);


  // =====================================================
  // FACULTY CLICK
  // =====================================================

  const handleFacultyClick = (id) => {

    setSelectedFaculty((current) => {

      if (current === id) {

        return null;

      }

      return id;

    });

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section
      id="faculties"
      className="faculties-section"
    >

      <div className="faculties-container">


        {/* =================================================
            HEADING
        ================================================= */}

        <div className="faculties-heading">

          <span>
            OUR FACULTY
          </span>


          <h1>
            Meet Our Faculty
          </h1>


          <p>
            Our dedicated faculty members are committed
            to providing quality education and guiding
            students towards success.
          </p>

        </div>



        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="faculties-message">

            <div className="faculties-message-icon">
              ⏳
            </div>


            <h3>
              Loading Faculty...
            </h3>


            <p>
              Please wait while the faculty information
              is being loaded.
            </p>

          </div>

        )}



        {/* =================================================
            NO FACULTY
        ================================================= */}

        {!loading &&
        faculties.length === 0 && (

          <div className="faculties-message">

            <div className="faculties-message-icon">
              👩‍🏫
            </div>


            <h3>
              No Faculty Added Yet
            </h3>


            <p>
              Faculty information will be updated soon.
            </p>

          </div>

        )}



        {/* =================================================
            FACULTY GRID
        ================================================= */}

        {!loading &&
        faculties.length > 0 && (

          <div className="faculties-grid">

            {faculties.map(
              (faculty) => (

                <div
                  className={`faculty-card ${
                    selectedFaculty === faculty.id
                      ? "faculty-card-active"
                      : ""
                  }`}
                  key={faculty.id}
                >


                  {/* =====================================
                      IMAGE
                  ===================================== */}

                  <div
                    className="faculty-image-container"
                    onClick={() =>
                      handleFacultyClick(
                        faculty.id
                      )
                    }
                    role="button"
                    tabIndex="0"
                    onKeyDown={(event) => {

                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {

                        handleFacultyClick(
                          faculty.id
                        );

                      }

                    }}
                  >

                    {faculty.image ? (

                      <img
                        src={faculty.image}
                        alt={
                          faculty.name ||
                          "Faculty member"
                        }
                        className="faculty-image"
                        loading="lazy"
                        onError={(event) => {

                          console.error(
                            "❌ Faculty image failed:",
                            faculty.image
                          );

                          event.currentTarget.style.display =
                            "none";

                        }}
                      />

                    ) : (

                      <div className="faculty-image-placeholder">

                        <span>
                          👩‍🏫
                        </span>

                      </div>

                    )}

                  </div>



                  {/* =====================================
                      NAME
                  ===================================== */}

                  <div className="faculty-name">

                    <h2>
                      {faculty.name ||
                        "Faculty Member"}
                    </h2>

                  </div>



                  {/* =====================================
                      DETAILS
                  ===================================== */}

                  {selectedFaculty === faculty.id && (

                    <div className="faculty-info">


                      {/* DESIGNATION */}

                      <div className="faculty-info-item">

                        <strong>
                          Designation:
                        </strong>

                        <span>
                          {faculty.designation ||
                            "Not available"}
                        </span>

                      </div>



                      {/* QUALIFICATION */}

                      <div className="faculty-info-item">

                        <strong>
                          Qualification:
                        </strong>

                        <span>
                          {faculty.qualification ||
                            "Not available"}
                        </span>

                      </div>


                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>

    </section>

  );

}


export default Faculties;