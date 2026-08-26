import "./Hero.css";
import collegeImage from "../assets/college.jpg";

function Hero() {
  return (
    <section
      id="home"
      className="hero"
      style={{ backgroundImage: `url(${collegeImage})` }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="hero-small-title">
          WELCOME TO
        </p>

        <h1>
          Shree Narayana Guru
          <br />
          Composite PU College
        </h1>

        <p className="hero-location">
          Mulki, Mangaluru
        </p>

        <button
          className="hero-button"
          onClick={() =>
            document.getElementById("about")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          Explore College
        </button>
      </div>
    </section>
  );
}

export default Hero;