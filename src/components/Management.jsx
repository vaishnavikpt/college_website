import "./Management.css";

function Management() {

  const managementMembers = [
    {
      name: "Principal Name",
      designation: "Principal",
      description:
        "Information about the Principal will be added here later.",
    },
    {
      name: "Correspondent Name",
      designation: "Correspondent",
      description:
        "Information about the Correspondent will be added here later.",
    },
    {
      name: "Administrator Name",
      designation: "Administrator",
      description:
        "Information about the Administrator will be added here later.",
    },
  ];

  return (
    <section id="management" className="management">

      <div className="management-container">

        <div className="management-heading">

          <p className="management-small-title">
            MANAGEMENT & ADMINISTRATION
          </p>

          <h2>
            Our <span>Leadership</span>
          </h2>

          <p>
            Meet the people who guide and support the growth,
            development and administration of our institution.
          </p>

        </div>


        <div className="management-grid">

          {managementMembers.map((member, index) => (

            <div className="management-card" key={index}>

              <div className="management-image">
                <div className="person-placeholder">
                  👤
                </div>
              </div>

              <div className="management-info">

                <h3>
                  {member.name}
                </h3>

                <h4>
                  {member.designation}
                </h4>

                <p>
                  {member.description}
                </p>

              </div>

            </div>

          ))}

        </div>


        <div className="management-note">

          <h3>About the Management</h3>

          <p>
            Information about the management and governing body
            of Shree Narayana Guru Composite PU College will be
            displayed here. This information can be updated
            through the administration system in the future.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Management;