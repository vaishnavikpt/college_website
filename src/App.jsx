import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Courses from "./components/Courses";
import Facilities from "./components/Facilities";
import Events from "./components/Events";
import Achievements from "./components/Achievements";
import Faculties from "./components/Faculties";
import Management from "./components/Management";
import Contact from "./components/Contact";

import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";


function Home() {
  return (
    <>
      <Hero />
      <About />
    </>
  );
}


function App() {
  return (
    <HashRouter>

      <div className="app">

        <Navbar />

        <main>

          <Routes>

            {/* ================================
                DEFAULT PAGE
            ================================= */}

            <Route
              path="/"
              element={
                <Navigate
                  to="/home"
                  replace
                />
              }
            />


            {/* ================================
                HOME + ABOUT
            ================================= */}

            <Route
              path="/home"
              element={<Home />}
            />


            {/* ================================
                COURSES
            ================================= */}

            <Route
              path="/courses"
              element={<Courses />}
            />


            {/* ================================
                FACILITIES
            ================================= */}

            <Route
              path="/facilities"
              element={<Facilities />}
            />


            {/* ================================
                EVENTS
            ================================= */}

            <Route
              path="/events"
              element={<Events />}
            />


            {/* ================================
                ACHIEVEMENTS
            ================================= */}

            <Route
              path="/achievements"
              element={<Achievements />}
            />


            {/* ================================
                FACULTIES
            ================================= */}

            <Route
              path="/faculties"
              element={<Faculties />}
            />


            {/* ================================
                MANAGEMENT
            ================================= */}

            <Route
              path="/management"
              element={<Management />}
            />


            {/* ================================
                CONTACT
            ================================= */}

            <Route
              path="/contact"
              element={<Contact />}
            />


            {/* ================================
                ADMIN LOGIN
            ================================= */}

            <Route
              path="/admin-login"
              element={<AdminLogin />}
            />


            {/* ================================
                ADMIN PANEL
            ================================= */}

            <Route
              path="/admin-panel"
              element={<AdminPanel />}
            />

          </Routes>

        </main>

      </div>

    </HashRouter>
  );
}

export default App;