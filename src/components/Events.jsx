import { useState } from "react";
import "./Events.css";

function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  /*
    Later this data will come from the database.

    Each event can have multiple images.
    The first image will be displayed on the card.
  */

  const events = [
    // Example for later:

    // {
    //   title: "Annual Day",
    //   images: [
    //     "/images/annual-day-1.jpg",
    //     "/images/annual-day-2.jpg",
    //   ],
    //   description:
    //     "Complete explanation about the Annual Day event..."
    // },

  ];

  return (
    <section id="events" className="events">

      <div className="events-container">

        {/* =========================
            HEADING
        ========================= */}

        <div className="events-heading">

          <p className="events-small-title">
            COLLEGE EVENTS
          </p>

          <h2>
            Events & <span>Activities</span>
          </h2>

          <p>
            Explore the events and activities conducted
            at Shree Narayana Guru Composite PU College.
          </p>

        </div>


        {/* =========================
            EVENTS
        ========================= */}

        {events.length > 0 ? (

          <div className="events-grid">

            {events.map((event, index) => (

              <div
                className="event-card"
                key={index}
                onClick={() => setSelectedEvent(event)}
              >

                {/* IMAGE */}

                <div className="event-card-image">

                  {event.images && event.images.length > 0 ? (

                    <img
                      src={event.images[0]}
                      alt={event.title}
                    />

                  ) : (

                    <div className="event-image-placeholder">
                      📷
                    </div>

                  )}

                </div>


                {/* TITLE */}

                <div className="event-card-content">

                  <h3>
                    {event.title}
                  </h3>

                  <span className="event-view">
                    View Details →
                  </span>

                </div>

              </div>

            ))}

          </div>

        ) : (

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


        {/* =========================
            EVENT POPUP
        ========================= */}

        {selectedEvent && (

          <div
            className="event-modal-overlay"
            onClick={() => setSelectedEvent(null)}
          >

            <div
              className="event-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {/* CLOSE BUTTON */}

              <button
                className="event-close"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>


              {/* MAIN IMAGE */}

              {selectedEvent.images &&
              selectedEvent.images.length > 0 && (

                <div className="event-modal-main-image">

                  <img
                    src={selectedEvent.images[0]}
                    alt={selectedEvent.title}
                  />

                </div>

              )}


              {/* CONTENT */}

              <div className="event-modal-content">

                <h2>
                  {selectedEvent.title}
                </h2>

                <p>
                  {selectedEvent.description}
                </p>


                {/* OTHER IMAGES */}

                {selectedEvent.images &&
                selectedEvent.images.length > 1 && (

                  <div className="event-modal-gallery">

                    {selectedEvent.images.map(
                      (image, index) => (

                        <img
                          key={index}
                          src={image}
                          alt={`${selectedEvent.title} ${index + 1}`}
                        />

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