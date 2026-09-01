import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

import "./Events.css";


function Events() {

  /* =====================================================
     EVENTS
  ===================================================== */

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);


  /* =====================================================
     SELECTED EVENT / MODAL
  ===================================================== */

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);


  /* =====================================================
     LOAD EVENTS FROM FIRESTORE
  ===================================================== */

  useEffect(() => {

    const loadEvents = async () => {

      try {

        setLoading(true);


        const eventsRef = collection(
          db,
          "events"
        );


        const eventsQuery = query(
          eventsRef,
          orderBy("order", "asc")
        );


        const snapshot =
          await getDocs(eventsQuery);


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

        setLoading(false);

      }

    };


    loadEvents();

  }, []);


  /* =====================================================
     OPEN EVENT
  ===================================================== */

  const openEvent = (event) => {

    setSelectedEvent(event);

    setCurrentImageIndex(0);

  };


  /* =====================================================
     CLOSE EVENT
  ===================================================== */

  const closeEvent = () => {

    setSelectedEvent(null);

    setCurrentImageIndex(0);

  };


  /* =====================================================
     PREVIOUS IMAGE
  ===================================================== */

  const showPreviousImage = () => {

    if (
      !selectedEvent ||
      !selectedEvent.images ||
      selectedEvent.images.length <= 1
    ) {

      return;

    }


    setCurrentImageIndex((currentIndex) => {

      if (currentIndex === 0) {

        return (
          selectedEvent.images.length - 1
        );

      }

      return currentIndex - 1;

    });

  };


  /* =====================================================
     NEXT IMAGE
  ===================================================== */

  const showNextImage = () => {

    if (
      !selectedEvent ||
      !selectedEvent.images ||
      selectedEvent.images.length <= 1
    ) {

      return;

    }


    setCurrentImageIndex((currentIndex) => {

      if (
        currentIndex ===
        selectedEvent.images.length - 1
      ) {

        return 0;

      }

      return currentIndex + 1;

    });

  };


  /* =====================================================
     KEYBOARD CONTROLS
  ===================================================== */

  useEffect(() => {

    const handleKeyDown = (event) => {

      if (!selectedEvent) {

        return;

      }


      if (event.key === "Escape") {

        closeEvent();

      }


      if (event.key === "ArrowLeft") {

        showPreviousImage();

      }


      if (event.key === "ArrowRight") {

        showNextImage();

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

  }, [
    selectedEvent,
  ]);


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <section
      id="events"
      className="events"
    >

      <div className="events-container">


        {/* =================================================
            HEADING
        ================================================= */}

        <div className="events-heading">

          <p className="events-small-title">
            COLLEGE EVENTS
          </p>


          <h2>

            Events &{" "}

            <span>
              Activities
            </span>

          </h2>


          <p>

            Explore the events and activities
            conducted at Shree Narayana Guru
            Composite PU College.

          </p>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="events-empty">

            <div className="events-empty-icon">
              ⏳
            </div>

            <h3>
              Loading Events...
            </h3>

            <p>
              Please wait while event information
              is being loaded.
            </p>

          </div>

        )}


        {/* =================================================
            EVENTS
        ================================================= */}

        {!loading && events.length > 0 && (

          <div className="events-grid">

            {events.map((event) => (

              <div
                className="event-card"
                key={event.id}
                onClick={() =>
                  openEvent(event)
                }
              >


                {/* =========================================
                    CARD IMAGE
                ========================================= */}

                <div className="event-card-image">

                  {event.images &&
                  event.images.length > 0 ? (

                    <img
                      src={event.images[0]}
                      alt={event.name || "Event"}
                    />

                  ) : (

                    <div className="event-image-placeholder">
                      📷
                    </div>

                  )}

                </div>


                {/* =========================================
                    CARD CONTENT
                ========================================= */}

                <div className="event-card-content">

                  <h3>

                    {event.name}

                  </h3>


                  <span className="event-view">

                    View Details →

                  </span>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* =================================================
            NO EVENTS
        ================================================= */}

        {!loading && events.length === 0 && (

          <div className="events-empty">

            <div className="events-empty-icon">
              📅
            </div>


            <h3>
              No Events Added Yet
            </h3>


            <p>
              Event information will be updated soon.
            </p>

          </div>

        )}


        {/* =================================================
            EVENT MODAL
        ================================================= */}

        {selectedEvent && (

          <div
            className="event-modal-overlay"
            onClick={closeEvent}
          >


            <div
              className="event-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              {/* ===========================================
                  CLOSE BUTTON
              =========================================== */}

              <button
                className="event-close"
                onClick={closeEvent}
                aria-label="Close"
              >
                ×
              </button>


              {/* ===========================================
                  EVENT TITLE
              =========================================== */}

              <div className="event-modal-title">

                <h2>
                  {selectedEvent.name}
                </h2>

              </div>


              {/* ===========================================
                  IMAGE SECTION
              =========================================== */}

              <div className="event-modal-image-section">


                {selectedEvent.images &&
                selectedEvent.images.length > 0 ? (

                  <>


                    {/* =====================================
                        MAIN IMAGE
                    ===================================== */}

                    <div className="event-modal-main-image">

                      <img
                        src={
                          selectedEvent.images[
                            currentImageIndex
                          ]
                        }
                        alt={`${selectedEvent.name} ${
                          currentImageIndex + 1
                        }`}
                      />

                    </div>


                    {/* =====================================
                        PREVIOUS BUTTON
                    ===================================== */}

                    {selectedEvent.images.length >
                      1 && (

                      <button
                        className="event-modal-prev"
                        onClick={
                          showPreviousImage
                        }
                        aria-label="Previous image"
                      >
                        ‹
                      </button>

                    )}


                    {/* =====================================
                        NEXT BUTTON
                    ===================================== */}

                    {selectedEvent.images.length >
                      1 && (

                      <button
                        className="event-modal-next"
                        onClick={
                          showNextImage
                        }
                        aria-label="Next image"
                      >
                        ›
                      </button>

                    )}

                  </>

                ) : (

                  <div className="event-modal-no-image">

                    <div>
                      📷
                    </div>

                    <p>
                      No images available
                    </p>

                  </div>

                )}

              </div>


              {/* ===========================================
                  IMAGE COUNTER
              =========================================== */}

              {selectedEvent.images &&
              selectedEvent.images.length > 0 && (

                <div className="event-image-counter">

                  {currentImageIndex + 1}

                  {" / "}

                  {selectedEvent.images.length}

                </div>

              )}


              {/* ===========================================
                  EVENT DESCRIPTION
              =========================================== */}

              <div className="event-modal-content">

                <p>
                  {selectedEvent.description}
                </p>


                {/* =========================================
                    THUMBNAILS
                ========================================= */}

                {selectedEvent.images &&
                selectedEvent.images.length > 1 && (

                  <div className="event-modal-gallery">

                    {selectedEvent.images.map(
                      (image, index) => (

                        <button
                          key={index}
                          className={
                            index ===
                            currentImageIndex
                              ? "event-thumbnail active"
                              : "event-thumbnail"
                          }
                          onClick={() =>
                            setCurrentImageIndex(
                              index
                            )
                          }
                          aria-label={`View image ${
                            index + 1
                          }`}
                        >

                          <img
                            src={image}
                            alt={`${selectedEvent.name} thumbnail ${
                              index + 1
                            }`}
                          />

                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

      </div>

    </section>

  );

}


export default Events;   