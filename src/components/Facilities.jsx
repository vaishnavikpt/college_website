import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { db } from "./firebase";

import "./Facilities.css";

function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // IMAGE POPUP STATES
  // =====================================================

  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // =====================================================
  // LOAD FACILITIES FROM FIREBASE
  // =====================================================

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesRef = collection(db, "facilities");

        const facilitiesQuery = query(
          facilitiesRef,
          orderBy("order", "asc")
        );

        const snapshot = await getDocs(facilitiesQuery);

        const facilitiesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFacilities(facilitiesData);
      } catch (error) {
        console.error("Error loading facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // =====================================================
  // OPEN IMAGE POPUP
  // =====================================================

  const openImage = (facility, imageIndex) => {
    setSelectedFacility(facility);
    setSelectedImageIndex(imageIndex);
  };

  // =====================================================
  // CLOSE IMAGE POPUP
  // =====================================================

  const closeImage = () => {
    setSelectedFacility(null);
    setSelectedImageIndex(0);
  };

  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const showPreviousImage = () => {
    if (!selectedFacility) return;

    if (selectedImageIndex > 0) {
      setSelectedImageIndex((current) => current - 1);
    }
  };

  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const showNextImage = () => {
    if (!selectedFacility) return;

    if (
      selectedImageIndex <
      selectedFacility.images.length - 1
    ) {
      setSelectedImageIndex((current) => current + 1);
    }
  };

  // =====================================================
  // KEYBOARD CONTROLS
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedFacility) return;

      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFacility, selectedImageIndex]);

  // =====================================================
  // PUBLIC FACILITIES PAGE
  // =====================================================

  return (
    <section
      id="facilities"
      className="facilities"
    >
      <div className="facilities-container">

        {/* =================================================
            SECTION HEADING
        ================================================= */}

        <div className="facilities-heading">

          <p className="facilities-small-title">
            OUR FACILITIES
          </p>

          <h2>
            Facilities for{" "}
            <span>Student Life</span>
          </h2>

          <p>
            Our college provides facilities that support
            academic learning, practical education,
            creativity and student development.
          </p>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="facility-no-images">
            <p>Loading facilities...</p>
          </div>
        )}

        {/* =================================================
            FACILITIES
        ================================================= */}

        {!loading && (
          <div className="facilities-list">

            {facilities.map((facility, index) => (

              <div
                className="facility-section"
                key={facility.id}
              >

                {/* =========================================
                    FACILITY HEADER
                ========================================= */}

                <div className="facility-header">

                  <div className="facility-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>

                    <h3>
                      {facility.name}
                    </h3>

                    <p>
                      {facility.description}
                    </p>

                  </div>

                </div>

                {/* =========================================
                    FACILITY IMAGES
                ========================================= */}

                {facility.images &&
                facility.images.length > 0 ? (

                  <div className="facility-gallery">

                    {facility.images.map(
                      (image, imageIndex) => (

                        <div
                          className="facility-image"
                          key={imageIndex}
                          onClick={() =>
                            openImage(
                              facility,
                              imageIndex
                            )
                          }
                        >

                          <img
                            src={image}
                            alt={`${facility.name} ${
                              imageIndex + 1
                            }`}
                          />

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="facility-no-images">

                    <div className="facility-placeholder-icon">
                      📷
                    </div>

                    <p>
                      Images will be added soon
                    </p>

                  </div>

                )}

              </div>

            ))}

          </div>
        )}

      </div>

      {/* =====================================================
          IMAGE POPUP
      ===================================================== */}

      {selectedFacility && (
        <div
          className="facility-lightbox"
          onClick={closeImage}
        >

          <div
            className="facility-lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =============================================
                CLOSE BUTTON
            ============================================= */}

            <button
              className="facility-lightbox-close"
              onClick={closeImage}
              aria-label="Close image"
            >
              ×
            </button>

            {/* =============================================
                FACILITY NAME
            ============================================= */}

            <div className="facility-lightbox-title">

              <h3>
                {selectedFacility.name}
              </h3>

              <p>
                Image {selectedImageIndex + 1} of{" "}
                {selectedFacility.images.length}
              </p>

            </div>

            {/* =============================================
                IMAGE AREA
            ============================================= */}

            <div className="facility-lightbox-image-area">

              {/* PREVIOUS BUTTON */}

              <button
                className="facility-lightbox-arrow facility-lightbox-prev"
                onClick={showPreviousImage}
                disabled={selectedImageIndex === 0}
                aria-label="Previous image"
              >
                ‹
              </button>

              {/* IMAGE */}

              <img
                className="facility-lightbox-image"
                src={
                  selectedFacility.images[
                    selectedImageIndex
                  ]
                }
                alt={`${selectedFacility.name} ${
                  selectedImageIndex + 1
                }`}
              />

              {/* NEXT BUTTON */}

              <button
                className="facility-lightbox-arrow facility-lightbox-next"
                onClick={showNextImage}
                disabled={
                  selectedImageIndex ===
                  selectedFacility.images.length - 1
                }
                aria-label="Next image"
              >
                ›
              </button>

            </div>

            {/* =============================================
                IMAGE COUNTER
            ============================================= */}

            <div className="facility-lightbox-counter">

              {selectedImageIndex + 1} /{" "}
              {selectedFacility.images.length}

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default Facilities;