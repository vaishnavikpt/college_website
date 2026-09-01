import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

import "./AchievementsAdmin.css";


function AchievementsAdmin({ onBack }) {

  const [achievements, setAchievements] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);


  // =====================================================
  // CLOUDINARY DETAILS
  // =====================================================

  const CLOUDINARY_CLOUD_NAME = "xzeq2mx5";

  const CLOUDINARY_UPLOAD_PRESET = "college_images";


  // =====================================================
  // LOAD ACHIEVEMENTS
  // =====================================================

  const loadAchievements = async () => {

    try {

      setFetching(true);

      const achievementsRef =
        collection(db, "achievements");

      const achievementsQuery = query(
        achievementsRef,
        orderBy("order", "asc")
      );

      const snapshot =
        await getDocs(achievementsQuery);

      const achievementsData =
        snapshot.docs.map((item) => ({

          id: item.id,

          ...item.data(),

        }));

      setAchievements(achievementsData);

    } catch (error) {

      console.error(
        "Error loading achievements:",
        error
      );

      alert(
        "Unable to load achievements.\n\n" +
        error.message
      );

    } finally {

      setFetching(false);

    }

  };


  useEffect(() => {

    loadAchievements();

  }, []);


  // =====================================================
  // SELECT MULTIPLE IMAGES
  // =====================================================

  const handleImageSelect = (event) => {

    const files =
      Array.from(event.target.files);

    setSelectedImages(files);

  };


  // =====================================================
  // UPLOAD ONE IMAGE TO CLOUDINARY
  // =====================================================

  const uploadImage = async (file) => {

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );


    const response = await fetch(

      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,

      {
        method: "POST",
        body: formData,
      }

    );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error?.message ||
        "Image upload failed."
      );

    }


    return data.secure_url;

  };


  // =====================================================
  // ADD ACHIEVEMENT
  // =====================================================

  const handleAddAchievement = async (event) => {

    event.preventDefault();


    if (!title.trim()) {

      alert(
        "Please enter the achievement title."
      );

      return;

    }


    if (!description.trim()) {

      alert(
        "Please enter the achievement description."
      );

      return;

    }


    if (selectedImages.length === 0) {

      alert(
        "Please select at least one image."
      );

      return;

    }


    try {

      setLoading(true);


      // -----------------------------------------------
      // UPLOAD ALL IMAGES
      // -----------------------------------------------

      const imageUrls = [];


      for (
        const image of selectedImages
      ) {

        const imageUrl =
          await uploadImage(image);

        imageUrls.push(imageUrl);

      }


      // -----------------------------------------------
      // FIND NEXT ORDER
      // -----------------------------------------------

      const nextOrder =
        achievements.length > 0

          ? Math.max(

              ...achievements.map(
                (achievement) =>
                  Number(
                    achievement.order
                  ) || 0
              )

            ) + 1

          : 1;


      // -----------------------------------------------
      // SAVE TO FIRESTORE
      // -----------------------------------------------

      await addDoc(
        collection(
          db,
          "achievements"
        ),
        {

          title:
            title.trim(),

          description:
            description.trim(),

          images:
            imageUrls,

          order:
            nextOrder,

        }
      );


      alert(
        "Achievement added successfully!"
      );


      // -----------------------------------------------
      // RESET FORM
      // -----------------------------------------------

      setTitle("");

      setDescription("");

      setSelectedImages([]);


      const imageInput =
        document.getElementById(
          "achievement-images"
        );


      if (imageInput) {

        imageInput.value = "";

      }


      await loadAchievements();

    } catch (error) {

      console.error(
        "Error adding achievement:",
        error
      );


      alert(
        "Unable to add achievement.\n\n" +
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // DELETE ACHIEVEMENT
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this achievement?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      await deleteDoc(
        doc(
          db,
          "achievements",
          id
        )
      );


      alert(
        "Achievement deleted successfully!"
      );


      await loadAchievements();

    } catch (error) {

      console.error(
        "Error deleting achievement:",
        error
      );


      alert(
        "Unable to delete achievement.\n\n" +
        error.message
      );

    }

  };


  // =====================================================
  // START EDITING
  // =====================================================

  const handleEdit = (achievement) => {

    setEditingId(
      achievement.id
    );

    setTitle(
      achievement.title || ""
    );

    setDescription(
      achievement.description || ""
    );

    setSelectedImages([]);


    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };


  // =====================================================
  // UPDATE ACHIEVEMENT
  // =====================================================

  const handleUpdate = async (event) => {

    event.preventDefault();


    if (!title.trim()) {

      alert(
        "Please enter the achievement title."
      );

      return;

    }


    if (!description.trim()) {

      alert(
        "Please enter the achievement description."
      );

      return;

    }


    try {

      setLoading(true);


      const updateData = {

        title:
          title.trim(),

        description:
          description.trim(),

      };


      // -----------------------------------------------
      // IF NEW IMAGES ARE SELECTED
      // -----------------------------------------------

      if (
        selectedImages.length > 0
      ) {

        const imageUrls = [];


        for (
          const image of selectedImages
        ) {

          const imageUrl =
            await uploadImage(image);

          imageUrls.push(
            imageUrl
          );

        }


        updateData.images =
          imageUrls;

      }


      await updateDoc(

        doc(
          db,
          "achievements",
          editingId
        ),

        updateData

      );


      alert(
        "Achievement updated successfully!"
      );


      // -----------------------------------------------
      // RESET
      // -----------------------------------------------

      setEditingId(null);

      setTitle("");

      setDescription("");

      setSelectedImages([]);


      const imageInput =
        document.getElementById(
          "achievement-images"
        );


      if (imageInput) {

        imageInput.value = "";

      }


      await loadAchievements();

    } catch (error) {

      console.error(
        "Error updating achievement:",
        error
      );


      alert(
        "Unable to update achievement.\n\n" +
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setEditingId(null);

    setTitle("");

    setDescription("");

    setSelectedImages([]);


    const imageInput =
      document.getElementById(
        "achievement-images"
      );


    if (imageInput) {

      imageInput.value = "";

    }

  };


  // =====================================================
  // MOVE ACHIEVEMENT
  // =====================================================

  const moveAchievement = async (
    index,
    direction
  ) => {

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;


    if (
      newIndex < 0 ||
      newIndex >= achievements.length
    ) {

      return;

    }


    try {

      const currentAchievement =
        achievements[index];

      const otherAchievement =
        achievements[newIndex];


      const currentOrder =
        currentAchievement.order;

      const otherOrder =
        otherAchievement.order;


      // -----------------------------------------------
      // SWAP ORDER VALUES
      // -----------------------------------------------

      await updateDoc(

        doc(
          db,
          "achievements",
          currentAchievement.id
        ),

        {
          order:
            otherOrder,
        }

      );


      await updateDoc(

        doc(
          db,
          "achievements",
          otherAchievement.id
        ),

        {
          order:
            currentOrder,
        }

      );


      await loadAchievements();

    } catch (error) {

      console.error(
        "Error moving achievement:",
        error
      );


      alert(
        "Unable to change achievement order."
      );

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="achievements-admin">

      <div className="achievements-admin-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="achievements-admin-header">

          <div>

            <p className="achievements-admin-small-title">
              ADMINISTRATION
            </p>

            <h1>
              Achievements{" "}
              <span>& Recognition</span>
            </h1>

            <p>
              Add and manage achievements displayed
              on the college website.
            </p>

          </div>


          <button
            className="achievements-back-btn"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>


        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        <div className="achievements-admin-form-card">

          <h2>

            {editingId
              ? "Edit Achievement"
              : "Add Achievement"}

          </h2>


          <form
            onSubmit={
              editingId
                ? handleUpdate
                : handleAddAchievement
            }
          >


            {/* TITLE */}

            <div className="achievements-form-group">

              <label>
                Achievement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Enter achievement title"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="achievements-form-group">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Enter achievement description"
                rows="5"
              />

            </div>


            {/* IMAGES */}

            <div className="achievements-form-group">

              <label>
                Achievement Images
              </label>

              <input
                id="achievement-images"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageSelect
                }
              />


              <p className="achievements-image-help">
                You can select multiple images
                at once.
              </p>


              {selectedImages.length > 0 && (

                <p className="achievements-selected-count">

                  {selectedImages.length}{" "}

                  {selectedImages.length === 1
                    ? "image"
                    : "images"}{" "}

                  selected

                </p>

              )}

            </div>


            {/* BUTTONS */}

            <div className="achievements-form-buttons">

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
                  className="achievements-cancel-btn"
                  onClick={
                    handleCancelEdit
                  }
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>


        {/* =================================================
            EXISTING ACHIEVEMENTS
        ================================================= */}

        <div className="achievements-existing-card">

          <h2>
            Existing Achievements
          </h2>


          {fetching ? (

            <p className="achievements-loading">
              Loading achievements...
            </p>

          ) : achievements.length === 0 ? (

            <p className="achievements-empty">
              No achievements have been added yet.
            </p>

          ) : (

            <div className="achievements-table-wrapper">

              <table className="achievements-table">

                <thead>

                  <tr>

                    <th>
                      Order
                    </th>

                    <th>
                      Images
                    </th>

                    <th>
                      Achievement
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {achievements.map(
                    (
                      achievement,
                      index
                    ) => (

                      <tr
                        key={
                          achievement.id
                        }
                      >


                        {/* ORDER */}

                        <td>

                          <span className="achievements-order">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </span>

                        </td>


                        {/* IMAGES */}

                        <td>

                          <div className="achievements-thumbnails">

                            {achievement.images &&
                            achievement.images.length > 0 ? (

                              achievement.images
                                .slice(
                                  0,
                                  4
                                )
                                .map(
                                  (
                                    image,
                                    imageIndex
                                  ) => (

                                    <img
                                      key={
                                        imageIndex
                                      }
                                      src={
                                        image
                                      }
                                      alt=""
                                    />

                                  )
                                )

                            ) : (

                              <span>
                                No images
                              </span>

                            )}

                          </div>


                          {achievement.images &&
                          achievement.images.length >
                            4 && (

                            <small>

                              +
                              {achievement.images.length -
                                4}{" "}
                              more

                            </small>

                          )}

                        </td>


                        {/* TITLE */}

                        <td>

                          <strong>
                            {achievement.title}
                          </strong>

                        </td>


                        {/* DESCRIPTION */}

                        <td>

                          <p className="achievements-description">

                            {
                              achievement.description
                            }

                          </p>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="achievements-actions">


                            <button
                              onClick={() =>
                                handleEdit(
                                  achievement
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              className="achievements-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  achievement.id
                                )
                              }
                            >
                              Delete
                            </button>


                            <button
                              disabled={
                                index === 0
                              }
                              onClick={() =>
                                moveAchievement(
                                  index,
                                  "up"
                                )
                              }
                            >
                              ↑
                            </button>


                            <button
                              disabled={
                                index ===
                                achievements.length -
                                  1
                              }
                              onClick={() =>
                                moveAchievement(
                                  index,
                                  "down"
                                )
                              }
                            >
                              ↓
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


export default AchievementsAdmin;