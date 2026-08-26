import "./Facilities.css";

function Facilities() {
  const facilities = [
    {
      name: "Classrooms",
      description:
        "Spacious and well-maintained classrooms designed to provide a comfortable environment for effective learning.",
      images: [],
    },

    {
      name: "Science Lab",
      description:
        "A dedicated science laboratory that supports practical learning and experimentation.",
      images: [],
    },

    {
      name: "Computer Lab",
      description:
        "A computer laboratory that provides students with opportunities to develop their computer and technical skills.",
      images: [],
    },

    {
      name: "Library",
      description:
        "A learning space with resources that encourage reading, research and independent learning.",
      images: [],
    },

    {
      name: "Canteen",
      description:
        "A convenient space where students can take refreshments during their breaks.",
      images: [],
    },

    {
      name: "Playground",
      description:
        "An open space that encourages physical activity, sports and overall student development.",
      images: [],
    },

    {
      name: "Auditorium",
      description:
        "A dedicated space for college events, cultural programs and important gatherings.",
      images: [],
    },

    {
      name: "Seminar Hall",
      description:
        "A suitable space for seminars, presentations, workshops and academic activities.",
      images: [],
    },

    {
      name: "Open Air Stage",
      description:
        "An outdoor stage for cultural programs, celebrations and student activities.",
      images: [],
    },
  ];

  return (
    <section id="facilities" className="facilities">

      <div className="facilities-container">

        {/* =========================
            SECTION HEADING
        ========================= */}

        <div className="facilities-heading">

          <p className="facilities-small-title">
            OUR FACILITIES
          </p>

          <h2>
            Facilities for <span>Student Life</span>
          </h2>

          <p>
            Our college provides facilities that support academic
            learning, practical education, creativity and student
            development.
          </p>

        </div>


        {/* =========================
            FACILITIES
        ========================= */}

        <div className="facilities-list">

          {facilities.map((facility, index) => (

            <div
              className="facility-section"
              key={facility.name}
            >

              {/* FACILITY HEADER */}

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


              {/* FACILITY IMAGES */}

              {facility.images.length > 0 ? (

                <div className="facility-gallery">

                  {facility.images.map((image, imageIndex) => (

                    <div
                      className="facility-image"
                      key={imageIndex}
                    >

                      <img
                        src={image}
                        alt={`${facility.name} ${imageIndex + 1}`}
                      />

                    </div>

                  ))}

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

      </div>

    </section>
  );
}

export default Facilities;