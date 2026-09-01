import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

import "./AcademicAdmin.css";


function AcademicAdmin({ onBack }) {

  // =====================================================
  // FORM STATES
  // =====================================================

  const [stream, setStream] = useState("science");

  const [year, setYear] = useState("");

  const [collegePercentage, setCollegePercentage] =
    useState("");

  const [topStudent, setTopStudent] =
    useState("");

  const [marks, setMarks] = useState("");

  const [percentage, setPercentage] =
    useState("");


  // =====================================================
  // DATA STATES
  // =====================================================

  const [academicData, setAcademicData] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);


  // =====================================================
  // LOAD ACADEMIC DATA
  // =====================================================

  const loadAcademicData = async () => {

    try {

      setFetching(true);

      const academicRef =
        collection(
          db,
          "academicAchievements"
        );

      const snapshot =
        await getDocs(academicRef);


      const data =
        snapshot.docs.map((item) => ({

          id: item.id,

          ...item.data(),

        }));


      // =================================================
      // SORT
      // Science first
      // Then Commerce
      // =================================================

      data.sort((a, b) => {

        if (
          a.stream === "science" &&
          b.stream !== "science"
        ) {

          return -1;

        }

        if (
          a.stream !== "science" &&
          b.stream === "science"
        ) {

          return 1;

        }

        // Same stream → sort by year

        return String(a.year || "").localeCompare(
          String(b.year || "")
        );

      });


      setAcademicData(data);


    } catch (error) {

      console.error(
        "Error loading academic data:",
        error
      );

      alert(
        "Unable to load academic achievements.\n\n" +
        error.message
      );


    } finally {

      setFetching(false);

    }

  };


  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    loadAcademicData();

  }, []);


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setStream("science");

    setYear("");

    setCollegePercentage("");

    setTopStudent("");

    setMarks("");

    setPercentage("");

    setEditingId(null);

  };


  // =====================================================
  // ADD / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    // =================================================
    // VALIDATION
    // =================================================

    if (!year.trim()) {

      alert(
        "Please enter the year."
      );

      return;

    }


    if (!collegePercentage.trim()) {

      alert(
        "Please enter the college percentage."
      );

      return;

    }


    if (!topStudent.trim()) {

      alert(
        "Please enter the student's name."
      );

      return;

    }


    if (!marks.trim()) {

      alert(
        "Please enter the marks."
      );

      return;

    }


    if (!percentage.trim()) {

      alert(
        "Please enter the student's percentage."
      );

      return;

    }


    try {

      setLoading(true);


      // =================================================
      // DATA TO FIREBASE
      // =================================================

      const data = {

        stream:
          stream.trim().toLowerCase(),

        year:
          year.trim(),

        collegePercentage:
          collegePercentage.trim(),

        topStudent:
          topStudent.trim(),

        marks:
          marks.trim(),

        percentage:
          percentage.trim(),

      };


      const academicRef =
        collection(
          db,
          "academicAchievements"
        );


      // =================================================
      // UPDATE EXISTING STUDENT
      // =================================================

      if (editingId) {

        await updateDoc(

          doc(
            db,
            "academicAchievements",
            editingId
          ),

          data

        );


        alert(
          "Academic achievement updated successfully!"
        );

      }


      // =================================================
      // ADD NEW STUDENT
      // =================================================

      else {

        await addDoc(
          academicRef,
          data
        );


        alert(
          `${stream === "science"
            ? "Science"
            : "Commerce"} student added successfully!`
        );

      }


      // =================================================
      // RESET
      // =================================================

      resetForm();


      // =================================================
      // RELOAD DATA
      // =================================================

      await loadAcademicData();


    } catch (error) {

      console.error(
        "Error saving academic data:",
        error
      );


      alert(
        "Unable to save academic achievement.\n\n" +
        error.message
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (item) => {

    setEditingId(item.id);


    setStream(
      item.stream || "science"
    );


    setYear(
      item.year || ""
    );


    setCollegePercentage(
      item.collegePercentage || ""
    );


    setTopStudent(
      item.topStudent || ""
    );


    setMarks(
      item.marks || ""
    );


    setPercentage(
      item.percentage || ""
    );


    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this academic achievement?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      await deleteDoc(

        doc(
          db,
          "academicAchievements",
          id
        )

      );


      alert(
        "Academic achievement deleted successfully!"
      );


      await loadAcademicData();


    } catch (error) {

      console.error(
        "Error deleting academic data:",
        error
      );


      alert(
        "Unable to delete academic achievement.\n\n" +
        error.message
      );

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="academic-admin">

      <div className="academic-admin-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="academic-admin-header">

          <div>

            <p className="academic-admin-small-title">
              ADMINISTRATION
            </p>


            <h1>
              Academic <span>Excellence</span>
            </h1>


            <p>
              Add and manage Science and Commerce
              academic achievement data.
            </p>

          </div>


          <button
            className="academic-back-btn"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>



        {/* =================================================
            FORM
        ================================================= */}

        <div className="academic-admin-form-card">

          <h2>

            {editingId
              ? "Edit Academic Achievement"
              : "Add Academic Achievement"}

          </h2>


          <form
            onSubmit={handleSubmit}
          >


            {/* =================================================
                STREAM
            ================================================= */}

            <div className="academic-form-group">

              <label>
                Stream
              </label>


              <select
                value={stream}
                onChange={(e) =>
                  setStream(
                    e.target.value
                  )
                }
              >

                <option value="science">
                  Science
                </option>


                <option value="commerce">
                  Commerce
                </option>

              </select>

            </div>



            {/* =================================================
                YEAR
            ================================================= */}

            <div className="academic-form-group">

              <label>
                Year
              </label>


              <input
                type="text"
                value={year}
                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }
                placeholder="Example: 2025"
              />

            </div>



            {/* =================================================
                COLLEGE PERCENTAGE
            ================================================= */}

            <div className="academic-form-group">

              <label>
                College Percentage
              </label>


              <input
                type="text"
                value={collegePercentage}
                onChange={(e) =>
                  setCollegePercentage(
                    e.target.value
                  )
                }
                placeholder="Example: 91.45%"
              />

            </div>



            {/* =================================================
                STUDENT
            ================================================= */}

            <div className="academic-form-group">

              <label>
                Top Student
              </label>


              <input
                type="text"
                value={topStudent}
                onChange={(e) =>
                  setTopStudent(
                    e.target.value
                  )
                }
                placeholder="Enter student's name"
              />

            </div>



            {/* =================================================
                MARKS
            ================================================= */}

            <div className="academic-form-group">

              <label>
                Marks
              </label>


              <input
                type="text"
                value={marks}
                onChange={(e) =>
                  setMarks(
                    e.target.value
                  )
                }
                placeholder="Example: 585 / 600"
              />

            </div>



            {/* =================================================
                STUDENT PERCENTAGE
            ================================================= */}

            <div className="academic-form-group">

              <label>
                Student Percentage
              </label>


              <input
                type="text"
                value={percentage}
                onChange={(e) =>
                  setPercentage(
                    e.target.value
                  )
                }
                placeholder="Example: 97.5%"
              />

            </div>



            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="academic-form-buttons">

              <button
                type="submit"
                disabled={loading}
              >

                {loading

                  ? "Saving..."

                  : editingId

                  ? "Update Achievement"

                  : "Add Achievement"}

              </button>


              {editingId && (

                <button
                  type="button"
                  className="academic-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>



        {/* =================================================
            EXISTING DATA
        ================================================= */}

        <div className="academic-existing-card">

          <h2>
            Existing Academic Achievements
          </h2>


          <p className="academic-help-text">
            You can add multiple students for both
            Science and Commerce.
          </p>


          {fetching ? (

            <p>
              Loading academic achievements...
            </p>

          ) : academicData.length === 0 ? (

            <p>
              No academic achievements added yet.
            </p>

          ) : (

            <div className="academic-admin-table-wrapper">

              <table className="academic-admin-table">

                <thead>

                  <tr>

                    <th>
                      Stream
                    </th>


                    <th>
                      Year
                    </th>


                    <th>
                      College %
                    </th>


                    <th>
                      Student
                    </th>


                    <th>
                      Marks
                    </th>


                    <th>
                      Student %
                    </th>


                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {academicData.map(
                    (item) => (

                      <tr
                        key={item.id}
                      >

                        <td>

                          <strong>

                            {item.stream ===
                            "science"

                              ? "Science"

                              : "Commerce"}

                          </strong>

                        </td>


                        <td>
                          {item.year || "-"}
                        </td>


                        <td>
                          {item.collegePercentage || "-"}
                        </td>


                        <td>
                          {item.topStudent || "-"}
                        </td>


                        <td>
                          {item.marks || "-"}
                        </td>


                        <td>
                          {item.percentage || "-"}
                        </td>


                        <td>

                          <div className="academic-actions">

                            <button
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              className="academic-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </section>

  );

}


export default AcademicAdmin;