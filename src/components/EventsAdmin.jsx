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

import "./EventsAdmin.css";


function EventsAdmin({ onBack }) {

  // =====================================================
  // STATES
  // =====================================================

  const [events, setEvents] = useState([]);

  const [name, setName] = useState("");

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
  // LOAD EVENTS FROM FIRESTORE
  // =====================================================

  const loadEvents = async () => {

    try {

      setFetching(true);

      const eventsRef = collection(
        db,
        "events"
      );

      const eventsQuery = query(
        eventsRef,
        orderBy("order", "asc")
      );

      const snapshot = await getDocs(
        eventsQuery
      );

      const eventsData =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      setEvents(eventsData);

    } catch (error) {

      console.error(
        "Error loading events:",
        error
      );

      alert(
        "Unable to load events.\n\n" +
        error.message
      );

    } finally {

      setFetching(false);

    }

  };


  // =====================================================
  // LOAD EVENTS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    loadEvents();

  }, []);


  // =====================================================
  // SELECT MULTIPLE IMAGES
  // =====================================================

  const handleImageSelect = (event) => {

    const files = Array.from(
      event.target.files || []
    );

    console.log(
      "Selected images:",
      files.length
    );

    setSelectedImages(files);

  };


  // =====================================================
  // UPLOAD ONE IMAGE TO CLOUDINARY
  // =====================================================

  const uploadImage = async (file) => {

    try {

      if (!file) {

        throw new Error(
          "No image selected."
        );

      }


      console.log(
        "Uploading image:",
        file.name
      );


      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );


      const uploadUrl =
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


      console.log(
        "Cloudinary URL:",
        uploadUrl
      );

      console.log(
        "Upload preset:",
        CLOUDINARY_UPLOAD_PRESET
      );


      const response = await fetch(
        uploadUrl,
        {
          method: "POST",
          body: formData,
        }
      );


      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (!response.ok) {

        let errorMessage =
          "Cloudinary image upload failed.";


        try {

          const errorData =
            await response.json();

          console.error(
            "Cloudinary error:",
            errorData
          );


          errorMessage =
            errorData?.error?.message ||
            errorMessage;

        } catch {

          console.error(
            "Cloudinary returned an invalid response."
          );

        }


        throw new Error(
          errorMessage
        );

      }


      // =================================================
      // GET CLOUDINARY RESPONSE
      // =================================================

      const data =
        await response.json();


      console.log(
        "Cloudinary upload successful:",
        data
      );


      if (!data.secure_url) {

        throw new Error(
          "Cloudinary did not return an image URL."
        );

      }


      return data.secure_url;

    } catch (error) {

      console.error(
        "Cloudinary upload error:",
        error
      );


      throw new Error(
        `Image upload failed: ${error.message}`
      );

    }

  };


  // =====================================================
  // ADD EVENT
  // =====================================================

  const handleAddEvent = async (event) => {

    event.preventDefault();


    // =================================================
    // VALIDATION
    // =================================================

    if (!name.trim()) {

      alert(
        "Please enter the event name."
      );

      return;

    }


    if (!description.trim()) {

      alert(
        "Please enter the event description."
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


      // =================================================
      // UPLOAD ALL IMAGES
      // =================================================

      const imageUrls = [];


      console.log(
        `Starting upload of ${selectedImages.length} image(s)...`
      );


      for (
        let i = 0;
        i < selectedImages.length;
        i++
      ) {

        const image =
          selectedImages[i];


        console.log(
          `Uploading image ${i + 1} of ${selectedImages.length}:`,
          image.name
        );


        const imageUrl =
          await uploadImage(image);


        imageUrls.push(imageUrl);


        console.log(
          `Image ${i + 1} uploaded successfully.`
        );

      }


      // =================================================
      // FIND NEXT ORDER NUMBER
      // =================================================

      const nextOrder =
        events.length > 0
          ? Math.max(
              ...events.map(
                (item) =>
                  Number(item.order) || 0
              )
            ) + 1
          : 1;


      console.log(
        "Next event order:",
        nextOrder
      );


      // =================================================
      // SAVE EVENT TO FIRESTORE
      // =================================================

      await addDoc(
        collection(db, "events"),
        {
          name: name.trim(),

          description:
            description.trim(),

          images: imageUrls,

          order: nextOrder,
        }
      );


      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Event added successfully!"
      );


      // =================================================
      // RESET FORM
      // =================================================

      setName("");

      setDescription("");

      setSelectedImages([]);


      const imageInput =
        document.getElementById(
          "event-images"
        );


      if (imageInput) {

        imageInput.value = "";

      }


      // =================================================
      // RELOAD EVENTS
      // =================================================

      await loadEvents();

    } catch (error) {

      console.error(
        "Error adding event:",
        error
      );


      alert(
        "Unable to add event.\n\n" +
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // DELETE EVENT
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this event?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      await deleteDoc(
        doc(db, "events", id)
      );


      alert(
        "Event deleted successfully!"
      );


      await loadEvents();

    } catch (error) {

      console.error(
        "Error deleting event:",
        error
      );


      alert(
        "Unable to delete event.\n\n" +
        error.message
      );

    }

  };


  // =====================================================
  // START EDITING EVENT
  // =====================================================

  const handleEdit = (event) => {

    setEditingId(
      event.id
    );


    setName(
      event.name || ""
    );


    setDescription(
      event.description || ""
    );


    // New images are optional while editing
    setSelectedImages([]);


    const imageInput =
      document.getElementById(
        "event-images"
      );


    if (imageInput) {

      imageInput.value = "";

    }


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =====================================================
  // UPDATE EVENT
  // =====================================================

  const handleUpdate = async (event) => {

    event.preventDefault();


    // =================================================
    // VALIDATION
    // =================================================

    if (!name.trim()) {

      alert(
        "Please enter the event name."
      );

      return;

    }


    if (!description.trim()) {

      alert(
        "Please enter the event description."
      );

      return;

    }


    try {

      setLoading(true);


      // =================================================
      // BASIC UPDATE DATA
      // =================================================

      const updateData = {

        name:
          name.trim(),

        description:
          description.trim(),

      };


      // =================================================
      // IF NEW IMAGES WERE SELECTED
      // =================================================

      if (
        selectedImages.length > 0
      ) {

        const imageUrls = [];


        console.log(
          `Uploading ${selectedImages.length} new image(s)...`
        );


        for (
          let i = 0;
          i < selectedImages.length;
          i++
        ) {

          const image =
            selectedImages[i];


          const imageUrl =
            await uploadImage(
              image
            );


          imageUrls.push(
            imageUrl
          );

        }


        updateData.images =
          imageUrls;

      }


      // =================================================
      // UPDATE FIRESTORE
      // =================================================

      await updateDoc(
        doc(
          db,
          "events",
          editingId
        ),
        updateData
      );


      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Event updated successfully!"
      );


      // =================================================
      // RESET FORM
      // =================================================

      setEditingId(null);

      setName("");

      setDescription("");

      setSelectedImages([]);


      const imageInput =
        document.getElementById(
          "event-images"
        );


      if (imageInput) {

        imageInput.value = "";

      }


      // =================================================
      // RELOAD EVENTS
      // =================================================

      await loadEvents();

    } catch (error) {

      console.error(
        "Error updating event:",
        error
      );


      alert(
        "Unable to update event.\n\n" +
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

    setName("");

    setDescription("");

    setSelectedImages([]);


    const imageInput =
      document.getElementById(
        "event-images"
      );


    if (imageInput) {

      imageInput.value = "";

    }

  };


  // =====================================================
  // MOVE EVENT
  // =====================================================

  const moveEvent = async (
    index,
    direction
  ) => {

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;


    // =================================================
    // CHECK VALID INDEX
    // =================================================

    if (
      newIndex < 0 ||
      newIndex >= events.length
    ) {

      return;

    }


    try {

      const currentEvent =
        events[index];


      const otherEvent =
        events[newIndex];


      const currentOrder =
        Number(
          currentEvent.order
        );


      const otherOrder =
        Number(
          otherEvent.order
        );


      // =================================================
      // SWAP ORDER
      // =================================================

      await updateDoc(
        doc(
          db,
          "events",
          currentEvent.id
        ),
        {
          order: otherOrder,
        }
      );


      await updateDoc(
        doc(
          db,
          "events",
          otherEvent.id
        ),
        {
          order: currentOrder,
        }
      );


      // =================================================
      // RELOAD
      // =================================================

      await loadEvents();

    } catch (error) {

      console.error(
        "Error moving event:",
        error
      );


      alert(
        "Unable to change event order.\n\n" +
        error.message
      );

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="events-admin">

      <div className="events-admin-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="events-admin-header">

          <div>

            <p className="events-admin-small-title">
              ADMINISTRATION
            </p>


            <h1>

              Events{" "}

              <span>
                & Activities
              </span>

            </h1>


            <p>
              Add and manage events and activities
              displayed on the college website.
            </p>

          </div>


          <button
            type="button"
            className="events-back-btn"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>


        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        <div className="events-admin-form-card">

          <h2>

            {editingId
              ? "Edit Event"
              : "Add Event"}

          </h2>


          <form
            onSubmit={
              editingId
                ? handleUpdate
                : handleAddEvent
            }
          >


            {/* =================================================
                EVENT NAME
            ================================================= */}

            <div className="events-form-group">

              <label>
                Event / Activity Name
              </label>


              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter event name"
              />

            </div>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="events-form-group">

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
                placeholder="Enter event description"
                rows="5"
              />

            </div>


            {/* =================================================
                IMAGES
            ================================================= */}

            <div className="events-form-group">

              <label>
                Event Images
              </label>


              <input
                id="event-images"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageSelect
                }
              />


              <p className="events-image-help">
                You can select multiple images at once.
              </p>


              {/* =================================================
                  SELECTED IMAGE COUNT
              ================================================= */}

              {selectedImages.length > 0 && (

                <p className="events-selected-count">

                  {selectedImages.length}{" "}

                  {selectedImages.length === 1
                    ? "image"
                    : "images"}{" "}

                  selected

                </p>

              )}

            </div>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="events-form-buttons">

              <button
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Event"
                  : "Add Event"}

              </button>


              {editingId && (

                <button
                  type="button"
                  className="events-cancel-btn"
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
            EXISTING EVENTS
        ================================================= */}

        <div className="events-existing-card">

          <h2>
            Existing Events & Activities
          </h2>


          {/* =================================================
              LOADING
          ================================================= */}

          {fetching ? (

            <p className="events-loading">
              Loading events...
            </p>

          ) : events.length === 0 ? (

            <p className="events-empty">
              No events have been added yet.
            </p>

          ) : (

            <div className="events-table-wrapper">

              <table className="events-table">

                <thead>

                  <tr>

                    <th>
                      Order
                    </th>

                    <th>
                      Images
                    </th>

                    <th>
                      Event / Activity
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

                  {events.map(
                    (event, index) => (

                      <tr
                        key={
                          event.id
                        }
                      >


                        {/* =================================================
                            ORDER
                        ================================================= */}

                        <td>

                          <span className="events-order">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </span>

                        </td>


                        {/* =================================================
                            IMAGES
                        ================================================= */}

                        <td>

                          <div className="events-thumbnails">

                            {event.images &&
                            Array.isArray(
                              event.images
                            ) &&
                            event.images.length >
                              0 ? (

                              event.images
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
                                      alt={`${event.name} ${
                                        imageIndex + 1
                                      }`}
                                    />

                                  )
                                )

                            ) : (

                              <span>
                                No images
                              </span>

                            )}

                          </div>


                          {/* =================================================
                              MORE IMAGE COUNT
                          ================================================= */}

                          {event.images &&
                          Array.isArray(
                            event.images
                          ) &&
                          event.images.length >
                            4 && (

                            <small>

                              +
                              {event.images.length -
                                4}{" "}
                              more

                            </small>

                          )}

                        </td>


                        {/* =================================================
                            EVENT NAME
                        ================================================= */}

                        <td>

                          <strong>
                            {event.name}
                          </strong>

                        </td>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <td>

                          <p className="events-description">

                            {event.description}

                          </p>

                        </td>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <td>

                          <div className="events-actions">


                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  event
                                )
                              }
                            >
                              Edit
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              className="events-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  event.id
                                )
                              }
                            >
                              Delete
                            </button>


                            {/* MOVE UP */}

                            <button
                              type="button"
                              disabled={
                                index === 0
                              }
                              onClick={() =>
                                moveEvent(
                                  index,
                                  "up"
                                )
                              }
                            >
                              ↑
                            </button>


                            {/* MOVE DOWN */}

                            <button
                              type="button"
                              disabled={
                                index ===
                                events.length - 1
                              }
                              onClick={() =>
                                moveEvent(
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


export default EventsAdmin;