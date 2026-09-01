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
import "./FacilitiesAdmin.css";

function FacilitiesAdmin({ onBack }) {
  const [facilities, setFacilities] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingImages, setEditingImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =====================================================
     CLOUDINARY DETAILS
  ===================================================== */

  const CLOUDINARY_CLOUD_NAME = "xzeq2mx5";
  const CLOUDINARY_UPLOAD_PRESET = "college_images";


  /* =====================================================
     LOAD FACILITIES
  ===================================================== */

  const loadFacilities = async () => {
    try {
      setLoading(true);

      const facilitiesRef = collection(db, "facilities");

      const facilitiesQuery = query(
        facilitiesRef,
        orderBy("order", "asc")
      );

      const snapshot = await getDocs(facilitiesQuery);

      const data = snapshot.docs.map((item) => {
        const facility = item.data();

        /*
          Support both:
          images: [...]
          and old image field
        */

        let images = [];

        if (Array.isArray(facility.images)) {
          images = facility.images;
        } else if (Array.isArray(facility.image)) {
          images = facility.image;
        } else if (
          typeof facility.image === "string" &&
          facility.image.trim() !== ""
        ) {
          images = [facility.image];
        }

        return {
          id: item.id,
          name: facility.name || "",
          description: facility.description || "",
          order:
            typeof facility.order === "number"
              ? facility.order
              : 0,
          images,
        };
      });

      setFacilities(data);

    } catch (error) {
      console.error("Error loading facilities:", error);

      alert(
        `Unable to load facilities.\n\n${error.message}`
      );

    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadFacilities();
  }, []);


  /* =====================================================
     IMAGE SELECTION
  ===================================================== */

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files || []);

    setSelectedImages(files);
  };


  /* =====================================================
     UPLOAD ONE IMAGE TO CLOUDINARY
  ===================================================== */

  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
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

    if (!response.ok) {
      throw new Error(
        `Cloudinary upload failed for ${file.name}`
      );
    }

    const data = await response.json();

    return data.secure_url;
  };


  /* =====================================================
     UPLOAD MULTIPLE IMAGES
  ===================================================== */

  const uploadImages = async (files) => {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadedUrls = [];

    for (const file of files) {
      const url = await uploadImage(file);

      uploadedUrls.push(url);
    }

    return uploadedUrls;
  };


  /* =====================================================
     ADD FACILITY
  ===================================================== */

  const handleAddFacility = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter the facility name.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter the facility description.");
      return;
    }

    try {
      setSaving(true);

      /* Upload ALL selected images */

      const imageUrls = await uploadImages(
        selectedImages
      );

      /* Determine next order */

      const nextOrder =
        facilities.length > 0
          ? Math.max(
              ...facilities.map((facility) =>
                Number(facility.order) || 0
              )
            ) + 1
          : 1;

      /* Save to Firestore */

      await addDoc(collection(db, "facilities"), {
        name: name.trim(),

        description: description.trim(),

        images: imageUrls,

        order: nextOrder,
      });

      /* Reset form */

      setName("");
      setDescription("");
      setSelectedImages([]);

      const fileInput =
        document.getElementById(
          "facility-image-input"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadFacilities();

      alert("Facility added successfully!");

    } catch (error) {
      console.error("Error adding facility:", error);

      alert(
        `Unable to add facility.\n\n${error.message}`
      );

    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     START EDIT
  ===================================================== */

  const startEdit = (facility) => {
    setEditingId(facility.id);

    setName(facility.name);
    setDescription(facility.description);

    setEditingImages(facility.images || []);

    setSelectedImages([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const cancelEdit = () => {
    setEditingId(null);

    setName("");
    setDescription("");

    setSelectedImages([]);
    setEditingImages([]);

    const fileInput =
      document.getElementById(
        "facility-image-input"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };


  /* =====================================================
     UPDATE FACILITY
  ===================================================== */

  const handleUpdateFacility = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter the facility name.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter the facility description.");
      return;
    }

    try {
      setSaving(true);

      let finalImages = editingImages;

      /*
        If new images are selected,
        upload them and REPLACE the old images.
      */

      if (selectedImages.length > 0) {
        finalImages = await uploadImages(
          selectedImages
        );
      }

      await updateDoc(
        doc(db, "facilities", editingId),
        {
          name: name.trim(),

          description: description.trim(),

          images: finalImages,
        }
      );

      cancelEdit();

      await loadFacilities();

      alert("Facility updated successfully!");

    } catch (error) {
      console.error(
        "Error updating facility:",
        error
      );

      alert(
        `Unable to update facility.\n\n${error.message}`
      );

    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     DELETE FACILITY
  ===================================================== */

  const handleDelete = async (facilityId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this facility?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "facilities", facilityId)
      );

      await loadFacilities();

      alert("Facility deleted successfully!");

    } catch (error) {
      console.error(
        "Error deleting facility:",
        error
      );

      alert(
        `Unable to delete facility.\n\n${error.message}`
      );
    }
  };


  /* =====================================================
     MOVE FACILITY
  ===================================================== */

  const moveFacility = async (
    index,
    direction
  ) => {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= facilities.length
    ) {
      return;
    }

    try {
      const currentFacility =
        facilities[index];

      const otherFacility =
        facilities[newIndex];

      const currentOrder =
        currentFacility.order;

      const otherOrder =
        otherFacility.order;

      await updateDoc(
        doc(db, "facilities", currentFacility.id),
        {
          order: otherOrder,
        }
      );

      await updateDoc(
        doc(db, "facilities", otherFacility.id),
        {
          order: currentOrder,
        }
      );

      await loadFacilities();

    } catch (error) {
      console.error(
        "Error moving facility:",
        error
      );

      alert(
        `Unable to move facility.\n\n${error.message}`
      );
    }
  };


  /* =====================================================
     REMOVE SELECTED EDIT IMAGES
  ===================================================== */

  const removeEditingImage = (index) => {
    setEditingImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="facilities-admin">

      <div className="facilities-admin-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="facilities-admin-header">

          <div>

            <p className="facilities-admin-small-title">
              ADMINISTRATION
            </p>

            <h1>
              Facilities{" "}
              <span>Management</span>
            </h1>

            <p>
              Add and manage the facilities displayed
              on the college website.
            </p>

          </div>

          <button
            className="facilities-back-button"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <div className="facilities-form-card">

          <h2>
            {editingId
              ? "Edit Facility"
              : "Add Facility"}
          </h2>


          <form
            onSubmit={
              editingId
                ? handleUpdateFacility
                : handleAddFacility
            }
          >

            {/* FACILITY NAME */}

            <div className="facility-form-group">

              <label htmlFor="facility-name">
                Facility Name
              </label>

              <input
                id="facility-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter facility name"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="facility-form-group">

              <label htmlFor="facility-description">
                Description
              </label>

              <textarea
                id="facility-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Enter facility description"
              />

            </div>


            {/* IMAGES */}

            <div className="facility-form-group">

              <label htmlFor="facility-image-input">
                Facility Images
              </label>

              <input
                id="facility-image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageSelection
                }
              />

              <p className="facility-image-help">
                You can select multiple images at once.
              </p>


              {/* SELECTED COUNT */}

              {selectedImages.length > 0 && (

                <p className="facility-selected-count">

                  {selectedImages.length}{" "}
                  {selectedImages.length === 1
                    ? "image"
                    : "images"}{" "}
                  selected

                </p>

              )}


              {/* OLD EDIT IMAGES */}

              {editingId &&
                editingImages.length > 0 && (

                  <div className="editing-images-section">

                    <h3>
                      Current Images
                    </h3>

                    <div className="facility-preview-container">

                      {editingImages.map(
                        (
                          image,
                          index
                        ) => (

                          <div
                            className="facility-preview"
                            key={image}
                          >

                            <img
                              src={image}
                              alt={`Current facility ${index + 1}`}
                            />

                            <button
                              type="button"
                              className="preview-remove-button"
                              onClick={() =>
                                removeEditingImage(
                                  index
                                )
                              }
                            >
                              ×
                            </button>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}


              {/* NEW IMAGE PREVIEW */}

              {selectedImages.length > 0 && (

                <div className="facility-preview-container">

                  {selectedImages.map(
                    (file, index) => (

                      <div
                        className="facility-preview"
                        key={`${file.name}-${index}`}
                      >

                        <img
                          src={URL.createObjectURL(
                            file
                          )}
                          alt={`Selected ${index + 1}`}
                        />

                      </div>

                    )
                  )}

                </div>

              )}

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="facility-submit-button"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId
                ? "Update Facility"
                : "Add Facility"}

            </button>


            {/* CANCEL */}

            {editingId && (

              <button
                type="button"
                className="facility-cancel-main-button"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>

            )}

          </form>

        </div>


        {/* =================================================
            EXISTING FACILITIES
        ================================================= */}

        <div className="facilities-table-card">

          <h2>
            Existing Facilities
          </h2>


          {loading ? (

            <div className="facilities-loading">
              Loading facilities...
            </div>

          ) : facilities.length === 0 ? (

            <div className="facilities-empty">
              No facilities have been added yet.
            </div>

          ) : (

            <div className="facilities-table-wrapper">

              <table className="facilities-table">

                <thead>

                  <tr>

                    <th>
                      Order
                    </th>

                    <th>
                      Photo
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Images
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {facilities.map(
                    (
                      facility,
                      index
                    ) => (

                      <tr
                        key={facility.id}
                      >

                        {/* ORDER */}

                        <td>

                          <span className="facility-order">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                        </td>


                        {/* PHOTO */}

                        <td>

                          {facility.images &&
                          facility.images.length >
                            0 ? (

                            <img
                              className="facility-admin-image"
                              src={
                                facility
                                  .images[0]
                              }
                              alt={
                                facility.name
                              }
                            />

                          ) : (

                            <div className="facility-table-placeholder">
                              📷
                            </div>

                          )}

                        </td>


                        {/* NAME */}

                        <td>

                          <span className="facility-name">
                            {facility.name}
                          </span>

                        </td>


                        {/* DESCRIPTION */}

                        <td>

                          <span className="facility-description">
                            {
                              facility.description
                            }
                          </span>

                        </td>


                        {/* IMAGE COUNT */}

                        <td>

                          <span className="facility-image-count">
                            {facility.images
                              ? facility.images
                                  .length
                              : 0}{" "}
                            {facility.images &&
                            facility.images
                              .length ===
                              1
                              ? "image"
                              : "images"}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="facility-actions">

                            <button
                              className="facility-edit-button"
                              onClick={() =>
                                startEdit(
                                  facility
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              className="facility-delete-button"
                              onClick={() =>
                                handleDelete(
                                  facility.id
                                )
                              }
                            >
                              Delete
                            </button>


                            <button
                              className="facility-move-button"
                              onClick={() =>
                                moveFacility(
                                  index,
                                  "up"
                                )
                              }
                              disabled={
                                index ===
                                0
                              }
                              title="Move up"
                            >
                              ↑
                            </button>


                            <button
                              className="facility-move-button"
                              onClick={() =>
                                moveFacility(
                                  index,
                                  "down"
                                )
                              }
                              disabled={
                                index ===
                                facilities.length -
                                  1
                              }
                              title="Move down"
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

export default FacilitiesAdmin;