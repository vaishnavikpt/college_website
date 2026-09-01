import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";
import "./Management.css";

function Management() {
  const [managementMembers, setManagementMembers] =
    useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH MANAGEMENT MEMBERS FROM FIRESTORE
  // ==========================================

  const fetchManagementMembers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "management")
      );

      const members = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort(
          (a, b) =>
            (Number(a.order) || 0) -
            (Number(b.order) || 0)
        );

      setManagementMembers(members);
    } catch (error) {
      console.error(
        "Error loading management members:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchManagementMembers();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section
        id="management"
        className="management"
      >
        <div className="management-container">

          <div className="management-heading">

            <p className="management-small-title">
              MANAGEMENT & ADMINISTRATION
            </p>

            <h2>
              Our <span>Leadership</span>
            </h2>

          </div>

          <div className="management-loading">
            Loading management...
          </div>

        </div>
      </section>
    );
  }

  // ==========================================
  // FRONTEND
  // ==========================================

  return (
    <section
      id="management"
      className="management"
    >

      <div className="management-container">

        {/* ================================
            HEADING
        ================================= */}

        <div className="management-heading">

          <p className="management-small-title">
            MANAGEMENT & ADMINISTRATION
          </p>

          <h2>
            Our <span>Leadership</span>
          </h2>

          <p>
            Meet the people who guide and
            support our institution.
          </p>

        </div>


        {/* ================================
            MEMBERS
        ================================= */}

        {managementMembers.length === 0 ? (

          <div className="management-empty">
            No management information available.
          </div>

        ) : (

          <div className="management-grid">

            {managementMembers.map(
              (member) => (

                <div
                  className="management-card"
                  key={member.id}
                >

                  {/* PHOTO */}

                  <div className="management-image">

                    {member.image ? (

                      <img
                        src={member.image}
                        alt={member.name}
                      />

                    ) : (

                      <div className="person-placeholder">
                        👤
                      </div>

                    )}

                  </div>


                  {/* NAME + DESIGNATION */}

                  <div className="management-info">

                    <h3>
                      {member.name}
                    </h3>

                    <h4>
                      {member.designation}
                    </h4>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
}

export default Management;