import "./Contact.css";

function Contact() {
  return (
    <section className="contact-section" id="contact">

      {/* Heading */}
      <div className="contact-header">
        <span>GET IN TOUCH</span>

        <h1>
          Contact <strong>Us</strong>
        </h1>

        <p>
          We are happy to connect with students, parents and visitors.
        </p>
      </div>


      {/* Contact Information */}
      <div className="contact-container">

        {/* Address */}
        <div className="contact-card">
          <div className="contact-icon">📍</div>

          <div>
            <h3>Address</h3>
            <p>
              Shree Narayana Guru Composite PU College
              <br />
              Mulki, Karnataka - 574154
            </p>
          </div>
        </div>


        {/* Phone */}
        <div className="contact-card">
          <div className="contact-icon">☎</div>

          <div>
            <h3>Phone</h3>
            <p>08242952146</p>
          </div>
        </div>


        {/* Email */}
        <div className="contact-card">
          <div className="contact-icon">✉</div>

          <div>
            <h3>Email</h3>
            <p>principalss172@gmail.com</p>
          </div>
        </div>


        {/* Facebook */}
        <div className="contact-card">
          <div className="contact-icon">f</div>

          <div>
            <h3>Facebook</h3>
            <p>Shree Narayana Guru Mulki</p>
          </div>
        </div>

      </div>


      {/* Location */}
      <div className="contact-location">

        <div>
          <span>VISIT OUR CAMPUS</span>

          <h2>
            Shree Narayana Guru Composite PU College
          </h2>

          <p>
            Mulki, Karnataka - 574154
          </p>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Shree+Narayana+Guru+Composite+PU+College+Mulki"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Location →
        </a>

      </div>

    </section>
  );
}

export default Contact;