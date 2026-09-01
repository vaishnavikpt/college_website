import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

import "./FacultiesAdmin.css";


// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

const CLOUDINARY_CLOUD_NAME = "xzeq2mx5";

const CLOUDINARY_UPLOAD_PRESET = "college_images";


// =====================================================
// FACULTIES ADMIN
// =====================================================

function FacultiesAdmin({ onBack }) {

  // ===================================================
  // FACULTY DATA
  // ===================================================

  const [faculties, setFaculties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  // ===================================================
  // FORM DATA
  // ===================================================

  const [name, setName] = useState("");

  const [designation, setDesignation] = useState("");

  const [qualification, setQualification] = useState("");

  const [image, setImage] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [previewImage, setPreviewImage] = useState("");


  // ===================================================
  // EDIT
  // ===================================================

  const [editingId, setEditingId] = useState(null);


  // ===================================================
  // MESSAGE
  // ===================================================

  const [message, setMessage] = useState("");


  // ===================================================
  // LOAD FACULTIES
  // ===================================================

  const loadFaculties = async () => {

    try {

      setLoading(true);

      setMessage("");


      const facultiesRef =
        collection(db, "faculties");


      const snapshot =
        await getDocs(facultiesRef);


      const data =
        snapshot.docs.map((item) => ({

          id: item.id,

          ...item.data(),

        }));


      // ------------------------------------------------
      // Load saved order
      // ------------------------------------------------

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

          const savedIds =
            orderSnapshot.data().ids || [];


          const ordered = [];


          // Add according to saved order

          savedIds.forEach((id) => {

            const faculty =
              data.find(
                (item) =>
                  item.id === id
              );


            if (faculty) {

              ordered.push(faculty);

            }

          });


          // Add new faculties

          data.forEach((faculty) => {

            if (
              !savedIds.includes(
                faculty.id
              )
            ) {

              ordered.push(faculty);

            }

          });


          setFaculties(ordered);

        } else {

          setFaculties(data);

        }

      } catch (orderError) {

        console.warn(
          "Faculty order could not be loaded:",
          orderError
        );

        setFaculties(data);

      }

    } catch (error) {

      console.error(
        "Error loading faculties:",
        error
      );


      setMessage(
        "Unable to load faculty information."
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // LOAD WHEN PAGE OPENS
  // ===================================================

  useEffect(() => {

    loadFaculties();

  }, []);


  // ===================================================
  // IMAGE SELECT
  // ===================================================

  const handleImageChange = (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {

      return;

    }


    // Check image type

    if (!file.type.startsWith("image/")) {

      setMessage(
        "Please select an image file."
      );

      return;

    }


    // Check image size - 5 MB

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setMessage(
        "Image size must be less than 5 MB."
      );

      return;

    }


    setImageFile(file);


    const preview =
      URL.createObjectURL(file);


    setPreviewImage(preview);

    setMessage("");

  };


  // ===================================================
  // REMOVE IMAGE
  // ===================================================

  const handleRemoveImage = () => {

    setImage("");

    setImageFile(null);

    setPreviewImage("");

  };


  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm = () => {

    setEditingId(null);

    setName("");

    setDesignation("");

    setQualification("");

    setImage("");

    setImageFile(null);

    setPreviewImage("");

  };


  // ===================================================
  // EDIT FACULTY
  // ===================================================

  const handleEdit = (faculty) => {

    setEditingId(faculty.id);


    setName(
      faculty.name || ""
    );


    setDesignation(
      faculty.designation || ""
    );


    setQualification(
      faculty.qualification || ""
    );


    setImage(
      faculty.image || ""
    );


    setImageFile(null);

    setPreviewImage("");

    setMessage("");


    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };


  // ===================================================
  // UPLOAD IMAGE TO CLOUDINARY
  // ===================================================

  const uploadToCloudinary = async () => {

    if (!imageFile) {

      return image;

    }


    const formData =
      new FormData();


    formData.append(
      "file",
      imageFile
    );


    formData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );


    const uploadURL =
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


    const response =
      await fetch(
        uploadURL,
        {
          method: "POST",
          body: formData,
        }
      );


    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Cloudinary error:",
        errorText
      );

      throw new Error(
        "Image upload to Cloudinary failed."
      );

    }


    const data =
      await response.json();


    if (!data.secure_url) {

      throw new Error(
        "Cloudinary did not return an image URL."
      );

    }


    return data.secure_url;

  };


  // ===================================================
  // SAVE FACULTY
  // ===================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name.trim()) {

      setMessage(
        "Please enter faculty name."
      );

      return;

    }


    if (!designation.trim()) {

      setMessage(
        "Please enter designation."
      );

      return;

    }


    if (!qualification.trim()) {

      setMessage(
        "Please enter qualification."
      );

      return;

    }


    if (
      !editingId &&
      !imageFile &&
      !image
    ) {

      setMessage(
        "Please select a faculty image."
      );

      return;

    }


    try {

      setSaving(true);

      setMessage("");


      // -------------------------------------------------
      // UPLOAD IMAGE
      // -------------------------------------------------

      let finalImage = image;


      if (imageFile) {

        setMessage(
          "Uploading image..."
        );


        finalImage =
          await uploadToCloudinary();

      }


      // -------------------------------------------------
      // ADD NEW FACULTY
      // -------------------------------------------------

      if (!editingId) {

        const facultyData = {

          name:
            name.trim(),

          designation:
            designation.trim(),

          qualification:
            qualification.trim(),

          image:
            finalImage,

        };


        setMessage(
          "Saving faculty information..."
        );


        const newFacultyRef =
          await addDoc(
            collection(
              db,
              "faculties"
            ),
            facultyData
          );


        const newFaculty = {

          id:
            newFacultyRef.id,

          ...facultyData,

        };


        const newList = [

          ...faculties,

          newFaculty,

        ];


        setFaculties(
          newList
        );


        // Save display order

        await saveOrder(
          newList
        );


        setMessage(
          "Faculty added successfully."
        );

      }


      // -------------------------------------------------
      // UPDATE FACULTY
      // -------------------------------------------------

      else {

        const facultyRef =
          doc(
            db,
            "faculties",
            editingId
          );


        await updateDoc(
          facultyRef,
          {

            name:
              name.trim(),

            designation:
              designation.trim(),

            qualification:
              qualification.trim(),

            image:
              finalImage,

          }
        );


        const updatedList =
          faculties.map(
            (faculty) => {

              if (
                faculty.id ===
                editingId
              ) {

                return {

                  ...faculty,

                  name:
                    name.trim(),

                  designation:
                    designation.trim(),

                  qualification:
                    qualification.trim(),

                  image:
                    finalImage,

                };

              }


              return faculty;

            }
          );


        setFaculties(
          updatedList
        );


        setMessage(
          "Faculty updated successfully."
        );

      }


      resetForm();

    } catch (error) {

      console.error(
        "Error saving faculty:",
        error
      );


      setMessage(
        `Error: ${error.message}`
      );

    } finally {

      setSaving(false);

    }

  };


  // ===================================================
  // SAVE FACULTY ORDER
  // ===================================================

  const saveOrder = async (list) => {

    const ids =
      list.map(
        (faculty) =>
          faculty.id
      );


    await setDoc(

      doc(
        db,
        "facultySettings",
        "order"
      ),

      {
        ids,
      }

    );

  };


  // ===================================================
  // MOVE UP
  // ===================================================

  const moveUp = async (index) => {

    if (index === 0) {

      return;

    }


    const newList =
      [...faculties];


    const temporary =
      newList[index - 1];


    newList[index - 1] =
      newList[index];


    newList[index] =
      temporary;


    setFaculties(
      newList
    );


    try {

      await saveOrder(
        newList
      );


      setMessage(
        "Faculty order updated."
      );

    } catch (error) {

      console.error(
        "Error saving order:",
        error
      );


      setMessage(
        "Unable to save faculty order."
      );

    }

  };


  // ===================================================
  // MOVE DOWN
  // ===================================================

  const moveDown = async (index) => {

    if (
      index >=
      faculties.length - 1
    ) {

      return;

    }


    const newList =
      [...faculties];


    const temporary =
      newList[index + 1];


    newList[index + 1] =
      newList[index];


    newList[index] =
      temporary;


    setFaculties(
      newList
    );


    try {

      await saveOrder(
        newList
      );


      setMessage(
        "Faculty order updated."
      );

    } catch (error) {

      console.error(
        "Error saving order:",
        error
      );


      setMessage(
        "Unable to save faculty order."
      );

    }

  };


  // ===================================================
  // DELETE FACULTY
  // ===================================================

  const handleDelete = async (faculty) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${faculty.name}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setMessage(
        "Deleting faculty..."
      );


      await deleteDoc(

        doc(
          db,
          "faculties",
          faculty.id
        )

      );


      const newList =
        faculties.filter(
          (item) =>
            item.id !==
            faculty.id
        );


      setFaculties(
        newList
      );


      // Update saved order

      await saveOrder(
        newList
      );


      setMessage(
        "Faculty deleted successfully."
      );


      if (
        editingId ===
        faculty.id
      ) {

        resetForm();

      }

    } catch (error) {

      console.error(
        "Error deleting faculty:",
        error
      );


      setMessage(
        `Error: ${error.message}`
      );

    }

  };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <section className="faculties-admin">

      <div className="faculties-admin-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="faculties-admin-header">

          <div>

            <p className="faculties-admin-small-title">
              ADMINISTRATION
            </p>


            <h1>
              Manage <span>Faculties</span>
            </h1>


            <p>
              Add and manage faculty information
              displayed on the college website.
            </p>

          </div>


          <button
            type="button"
            className="faculties-back-button"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>



        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (

          <div className="faculties-message">

            {message}

          </div>

        )}



        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        <div className="faculty-form-card">

          <h2>

            {editingId
              ? "Edit Faculty"
              : "Add Faculty"}

          </h2>


          <form
            onSubmit={handleSubmit}
          >


            {/* NAME */}

            <div className="faculty-form-group">

              <label>
                Faculty Name
              </label>


              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Enter faculty name"
              />

            </div>



            {/* DESIGNATION */}

            <div className="faculty-form-group">

              <label>
                Designation
              </label>


              <input
                type="text"
                value={designation}
                onChange={(event) =>
                  setDesignation(
                    event.target.value
                  )
                }
                placeholder="Example: Lecturer - Physics"
              />

            </div>



            {/* QUALIFICATION */}

            <div className="faculty-form-group">

              <label>
                Qualification
              </label>


              <input
                type="text"
                value={qualification}
                onChange={(event) =>
                  setQualification(
                    event.target.value
                  )
                }
                placeholder="Example: M.Sc., B.Ed."
              />

            </div>



            {/* IMAGE */}

            <div className="faculty-form-group">

              <label>
                Faculty Image
              </label>


              <div className="image-upload-area">


                {/* IMAGE PREVIEW */}

                {(previewImage || image) && (

                  <div className="faculty-image-preview">

                    <img
                      src={
                        previewImage ||
                        image
                      }
                      alt="Faculty preview"
                    />

                  </div>

                )}



                {/* BUTTONS */}

                <div className="image-upload-buttons">

                  <label className="browse-image-button">

                    🖼️ Browse Image


                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      hidden
                    />

                  </label>



                  {(previewImage || image) && (

                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={
                        handleRemoveImage
                      }
                    >
                      ✕ Remove Image
                    </button>

                  )}

                </div>


                <p>
                  Select an image from your computer.
                  Maximum size: 5 MB.
                </p>

              </div>

            </div>



            {/* FORM BUTTONS */}

            <div className="faculty-form-buttons">

              <button
                type="submit"
                className="save-faculty-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Faculty"
                  : "Add Faculty"}

              </button>


              {editingId && (

                <button
                  type="button"
                  className="cancel-faculty-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>



        {/* =================================================
            FACULTY LIST
        ================================================= */}

        <div className="faculty-list-card">

          <div className="faculty-list-heading">

            <div>

              <h2>
                Faculty Members
              </h2>


              <p>

                {faculties.length} faculty member
                {faculties.length !== 1
                  ? "s"
                  : ""}

              </p>

            </div>

          </div>



          {/* LOADING */}

          {loading ? (

            <div className="faculty-loading">

              Loading faculties...

            </div>

          ) : faculties.length === 0 ? (

            /* EMPTY */

            <div className="faculty-empty">

              <div>
                👨‍🏫
              </div>


              <h3>
                No Faculty Members
              </h3>


              <p>
                Add your first faculty member above.
              </p>

            </div>

          ) : (

            /* LIST */

            <div className="faculty-admin-list">

              {faculties.map(
                (faculty, index) => (

                  <div
                    className="faculty-admin-item"
                    key={faculty.id}
                  >


                    {/* IMAGE */}

                    <div className="faculty-admin-image">

                      {faculty.image ? (

                        <img
                          src={
                            faculty.image
                          }
                          alt={
                            faculty.name ||
                            "Faculty"
                          }
                        />

                      ) : (

                        <div>
                          👨‍🏫
                        </div>

                      )}

                    </div>



                    {/* DETAILS */}

                    <div className="faculty-admin-details">

                      <h3>
                        {faculty.name ||
                          "Faculty Name"}
                      </h3>


                      <p>
                        {faculty.designation ||
                          "Designation not available"}
                      </p>


                      <span>
                        {faculty.qualification ||
                          "Qualification not available"}
                      </span>

                    </div>



                    {/* ACTIONS */}

                    <div className="faculty-admin-actions">


                      {/* MOVE UP */}

                      <button
                        type="button"
                        className="move-button"
                        onClick={() =>
                          moveUp(index)
                        }
                        disabled={
                          index === 0
                        }
                        title="Move Up"
                      >
                        ↑
                      </button>



                      {/* MOVE DOWN */}

                      <button
                        type="button"
                        className="move-button"
                        onClick={() =>
                          moveDown(index)
                        }
                        disabled={
                          index ===
                          faculties.length - 1
                        }
                        title="Move Down"
                      >
                        ↓
                      </button>



                      {/* EDIT */}

                      <button
                        type="button"
                        className="edit-faculty-button"
                        onClick={() =>
                          handleEdit(
                            faculty
                          )
                        }
                      >
                        Edit
                      </button>



                      {/* DELETE */}

                      <button
                        type="button"
                        className="delete-faculty-button"
                        onClick={() =>
                          handleDelete(
                            faculty
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </section>

  );

}


export default FacultiesAdmin;