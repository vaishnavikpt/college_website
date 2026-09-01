import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

import ManagementAdmin from "./ManagementAdmin";
import FacilitiesAdmin from "./FacilitiesAdmin";
import EventsAdmin from "./EventsAdmin";
import AchievementsAdmin from "./AchievementsAdmin";
import AcademicAdmin from "./AcademicAdmin";
import FacultiesAdmin from "./FacultiesAdmin";

import "./AdminPanel.css";


function AdminPanel() {

  const navigate = useNavigate();


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [user, setUser] =
    useState(null);


  // =====================================================
  // ACTIVE SECTION
  // =====================================================

  const [activeSection, setActiveSection] =
    useState(null);


  // =====================================================
  // CHECK AUTHENTICATION
  // =====================================================

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          if (currentUser) {

            setUser(currentUser);

          } else {

            navigate(
              "/admin-login",
              {
                replace: true,
              }
            );

          }

          setCheckingAuth(false);

        }
      );


    return () => unsubscribe();

  }, [navigate]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {

    try {

      await signOut(auth);

      navigate(
        "/admin-login",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    }

  };


  // =====================================================
  // AUTHENTICATION LOADING
  // =====================================================

  if (checkingAuth) {

    return (

      <section className="admin-panel">

        <div className="admin-panel-container">

          <p>
            Checking authentication...
          </p>

        </div>

      </section>

    );

  }


  // =====================================================
  // NO USER
  // =====================================================

  if (!user) {

    return null;

  }


  // =====================================================
  // MANAGEMENT
  // =====================================================

  if (activeSection === "management") {

    return (

      <ManagementAdmin
        onBack={() =>
          setActiveSection(null)
        }
      />

    );

  }


  // =====================================================
  // FACILITIES
  // =====================================================

  if (activeSection === "facilities") {

    return (

      <FacilitiesAdmin
        onBack={() =>
          setActiveSection(null)
        }
      />

    );

  }


  // =====================================================
  // EVENTS & ACTIVITIES
  // =====================================================

  if (activeSection === "events") {

    return (

      <EventsAdmin
        onBack={() =>
          setActiveSection(null)
        }
      />

    );

  }


  // =====================================================
  // ACHIEVEMENTS
  // =====================================================

  if (activeSection === "achievements") {

    return (

      <AchievementsAdmin
        onBack={() =>
          setActiveSection(null)
        }
      />

    );

  }


  // =====================================================
  // ACADEMIC EXCELLENCE
  // =====================================================

  if (activeSection === "academic") {

    return (

      <AcademicAdmin
        onBack={() =>
          setActiveSection(null)
        }
      />

    );

  }


  // =====================================================
  // FACULTIES
  // =====================================================

  if (activeSection === "faculties") {

    return (

      <FacultiesAdmin
        onBack={() =>
          setActiveSection(null)
        }
      />

    );

  }


  // =====================================================
  // MAIN ADMIN PANEL
  // =====================================================

  return (

    <section className="admin-panel">

      <div className="admin-panel-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-panel-header">

          <div>

            <p className="admin-small-title">
              ADMINISTRATION
            </p>


            <h1>
              Admin <span>Panel</span>
            </h1>


            <p>
              Manage the information displayed on the
              college website.
            </p>

          </div>


          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>



        {/* =================================================
            ADMIN OPTIONS
        ================================================= */}

        <div className="admin-options">


          {/* =================================================
              MANAGEMENT
          ================================================= */}

          <button
            onClick={() =>
              setActiveSection("management")
            }
          >
            Management
          </button>



          {/* =================================================
              FACILITIES
          ================================================= */}

          <button
            onClick={() =>
              setActiveSection("facilities")
            }
          >
            Facilities
          </button>



          {/* =================================================
              EVENTS & ACTIVITIES
          ================================================= */}

          <button
            onClick={() =>
              setActiveSection("events")
            }
          >
            Events & Activities
          </button>



          {/* =================================================
              ACHIEVEMENTS
          ================================================= */}

          <button
            onClick={() =>
              setActiveSection("achievements")
            }
          >
            Achievements
          </button>



          {/* =================================================
              ACADEMIC EXCELLENCE
          ================================================= */}

          <button
            onClick={() =>
              setActiveSection("academic")
            }
          >
            Academic Excellence
          </button>



          {/* =================================================
              FACULTIES
          ================================================= */}

          <button
            onClick={() =>
              setActiveSection("faculties")
            }
          >
            Faculties
          </button>


        </div>

      </div>

    </section>

  );

}


export default AdminPanel;