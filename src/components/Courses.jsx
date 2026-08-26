import "./Courses.css";

function Courses() {
  const scienceCourses = [
    {
      code: "PCMC",
      subjects: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Computer Science",
      ],
    },
    {
      code: "PCMB",
      subjects: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
      ],
    },
    {
      code: "PCMS",
      subjects: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Statistics",
      ],
    },
  ];

  const commerceCourses = [
    {
      code: "EABC",
      subjects: [
        "Economics",
        "Accountancy",
        "Business Studies",
        "Computer Science",
      ],
    },
    {
      code: "EABS",
      subjects: [
        "Economics",
        "Accountancy",
        "Business Studies",
        "Statistics",
      ],
    },
  ];

  return (
    <section id="courses" className="courses">

      <div className="courses-container">

        {/* =========================
            SECTION HEADING
        ========================= */}

        <div className="courses-heading">

          <p className="courses-small-title">
            OUR COURSES
          </p>

          <h2>
            Academic <span>Programs</span>
          </h2>

          <p>
            Explore the academic combinations and language
            options offered at Shree Narayana Guru Composite PU College.
          </p>

        </div>


        {/* =========================
            SCIENCE
        ========================= */}

        <div className="course-category">

          <div className="category-title">
            <h3>Science</h3>

            <span>
              03 Combinations
            </span>
          </div>

          <div className="courses-grid">

            {scienceCourses.map((course) => (

              <div
                className="course-card"
                key={course.code}
              >

                <div className="course-code">
                  {course.code}
                </div>

                <h4>Science</h4>

                <div className="course-line"></div>

                <ul>
                  {course.subjects.map((subject) => (
                    <li key={subject}>
                      {subject}
                    </li>
                  ))}
                </ul>

              </div>

            ))}

          </div>

        </div>


        {/* =========================
            COMMERCE
        ========================= */}

        <div className="course-category">

          <div className="category-title">

            <h3>Commerce</h3>

            <span>
              02 Combinations
            </span>

          </div>

          <div className="courses-grid commerce-grid">

            {commerceCourses.map((course) => (

              <div
                className="course-card"
                key={course.code}
              >

                <div className="course-code">
                  {course.code}
                </div>

                <h4>Commerce</h4>

                <div className="course-line"></div>

                <ul>
                  {course.subjects.map((subject) => (
                    <li key={subject}>
                      {subject}
                    </li>
                  ))}
                </ul>

              </div>

            ))}

          </div>

        </div>


        {/* =========================
            LANGUAGES
        ========================= */}

        <div className="languages-section">

          <div className="category-title">

            <h3>Languages</h3>

            <span>
              First & Second Language
            </span>

          </div>


          <div className="languages-grid">

            {/* FIRST LANGUAGE */}

            <div className="language-card">

              <div className="language-number">
                01
              </div>

              <div>
                <h4>First Language</h4>

                <p>
                  English
                </p>
              </div>

            </div>


            {/* SECOND LANGUAGE */}

            <div className="language-card">

              <div className="language-number">
                02
              </div>

              <div>
                <h4>Second Language</h4>

                <p>
                  Kannada <span>or</span> Hindi
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Courses;