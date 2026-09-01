import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";
import "./ManagementAdmin.css";

function ManagementAdmin() {
  const [members, setMembers] = useState([]);

  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // FETCH MANAGEMENT MEMBERS
  // ==========================================

  const fetchMembers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "management")
      );

      const memberList = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

      setMembers(memberList);
    } catch (error) {
      console.error(
        "Error fetching management members:",
        error
      );
    }
  };

  // ==========================================
  // LOAD MEMBERS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchMembers();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setName("");
    setQualification("");
    setDesignation("");
    setImage(null);
    setEditingId(null);

    const fileInput = document.getElementById(
      "management-image"
    );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ==========================================
  // ADD / UPDATE MEMBER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check name
    if (!name.trim()) {
      alert("Please enter the name.");
      return;
    }

    // Check designation
    if (!designation.trim()) {
      alert("Please enter the designation.");
      return;
    }

    // Photo required only when adding
    if (!editingId && !image) {
      alert("Please select a photo.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // ========================================
      // IF EDITING
      // KEEP OLD IMAGE
      // ========================================

      if (editingId) {
        const existingMember = members.find(
          (member) => member.id === editingId
        );

        imageUrl = existingMember?.image || "";
      }

      // ========================================
      // UPLOAD IMAGE TO CLOUDINARY
      // ========================================

      if (image) {
        const formData = new FormData();

        formData.append("file", image);

        formData.append(
          "upload_preset",
          "college_images"
        );

        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/xzeq2mx5/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error(
            "Cloudinary image upload failed."
          );
        }

        const cloudinaryData =
          await cloudinaryResponse.json();

        imageUrl =
          cloudinaryData.secure_url;
      }

      // ========================================
      // UPDATE EXISTING MEMBER
      // ========================================

      if (editingId) {
        await updateDoc(
          doc(db, "management", editingId),
          {
            name: name.trim(),
            qualification:
              qualification.trim(),
            designation:
              designation.trim(),
            image: imageUrl,
          }
        );

        alert(
          "Management member updated successfully!"
        );
      }

      // ========================================
      // ADD NEW MEMBER
      // ========================================

      else {
        let newOrder = 1;

        if (members.length > 0) {
          newOrder =
            Math.max(
              ...members.map(
                (member) =>
                  Number(member.order) || 0
              )
            ) + 1;
        }

        await addDoc(
          collection(db, "management"),
          {
            name: name.trim(),

            qualification:
              qualification.trim(),

            designation:
              designation.trim(),

            image: imageUrl,

            order: newOrder,
          }
        );

        alert(
          "Management member added successfully!"
        );
      }

      // Clear form
      resetForm();

      // Reload table
      await fetchMembers();

    } catch (error) {
     console.error(
    "Error saving management member:",
    error
  );

  alert(
    "ERROR: " + error.message
  );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT MEMBER
  // ==========================================

  const handleEdit = (member) => {
    setEditingId(member.id);

    setName(member.name || "");

    setQualification(
      member.qualification || ""
    );

    setDesignation(
      member.designation || ""
    );

    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE MEMBER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this management member?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "management", id)
      );

      await fetchMembers();

      alert(
        "Management member deleted successfully!"
      );

    } catch (error) {
      console.error(
        "Error deleting management member:",
        error
      );

      alert(
        "Unable to delete the member."
      );
    }
  };

  // ==========================================
  // MOVE MEMBER UP
  // ==========================================

  const handleMoveUp = async (index) => {
    if (index === 0) {
      return;
    }

    const currentMember =
      members[index];

    const previousMember =
      members[index - 1];

    try {
      await updateDoc(
        doc(
          db,
          "management",
          currentMember.id
        ),
        {
          order: previousMember.order,
        }
      );

      await updateDoc(
        doc(
          db,
          "management",
          previousMember.id
        ),
        {
          order: currentMember.order,
        }
      );

      await fetchMembers();

    } catch (error) {
      console.error(
        "Error moving member up:",
        error
      );

      alert(
        "Unable to move the member."
      );
    }
  };

  // ==========================================
  // MOVE MEMBER DOWN
  // ==========================================

  const handleMoveDown = async (index) => {
    if (
      index ===
      members.length - 1
    ) {
      return;
    }

    const currentMember =
      members[index];

    const nextMember =
      members[index + 1];

    try {
      await updateDoc(
        doc(
          db,
          "management",
          currentMember.id
        ),
        {
          order: nextMember.order,
        }
      );

      await updateDoc(
        doc(
          db,
          "management",
          nextMember.id
        ),
        {
          order: currentMember.order,
        }
      );

      await fetchMembers();

    } catch (error) {
      console.error(
        "Error moving member down:",
        error
      );

      alert(
        "Unable to move the member."
      );
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <section className="management-admin">

      <div className="management-admin-container">

        {/* ================================
            HEADER
        ================================= */}

        <div className="management-admin-header">

          <p className="management-admin-small-title">
            ADMIN PANEL
          </p>

          <h1>
            Management
          </h1>

          <p>
            Add and manage the college
            management members.
          </p>

        </div>


        {/* ================================
            ADD / EDIT FORM
        ================================= */}

        <div className="management-form-card">

          <h2>
            {editingId
              ? "Edit Management Member"
              : "Add Management Member"}
          </h2>


          <form onSubmit={handleSubmit}>

            {/* PHOTO */}

            <div className="management-form-group">

              <label>
                Photo
              </label>

              <input
                id="management-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(
                    e.target.files[0]
                  );
                }}
              />

            </div>


            {/* NAME */}

            <div className="management-form-group">

              <label>
                Name
              </label>

              <input
                type="text"
                placeholder="Enter person's name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>


            {/* QUALIFICATION */}

            <div className="management-form-group">

              <label>
                Qualification
              </label>

              <input
                type="text"
                placeholder="Enter qualification"
                value={qualification}
                onChange={(e) =>
                  setQualification(
                    e.target.value
                  )
                }
              />

            </div>


            {/* DESIGNATION */}

            <div className="management-form-group">

              <label>
                Designation
              </label>

              <input
                type="text"
                placeholder="Example: Manager, Member, President"
                value={designation}
                onChange={(e) =>
                  setDesignation(
                    e.target.value
                  )
                }
              />

            </div>


            {/* FORM BUTTONS */}

            <div className="management-form-buttons">

              <button
                type="submit"
                className="management-add-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Member"
                  : "Add Member"}
              </button>


              {editingId && (

                <button
                  type="button"
                  className="management-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>


        {/* ================================
            MANAGEMENT TABLE
        ================================= */}

        <div className="management-table-card">

          <h2>
            Existing Management Members
          </h2>


          <div className="management-table-wrapper">

            <table className="management-table">

              <thead>

                <tr>

                  <th>
                    Photo
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Designation
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {members.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="management-empty"
                    >
                      No management members
                      found.
                    </td>

                  </tr>

                ) : (

                  members.map(
                    (member, index) => (

                      <tr
                        key={member.id}
                      >

                        {/* PHOTO */}

                        <td>

                          {member.image ? (

                            <img
                              src={
                                member.image
                              }
                              alt={
                                member.name
                              }
                              className="management-table-image"
                            />

                          ) : (

                            <div className="management-no-image">
                              No Image
                            </div>

                          )}

                        </td>


                        {/* NAME */}

                        <td>
                          {member.name}
                        </td>


                        {/* DESIGNATION */}

                        <td>
                          {member.designation}
                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="management-actions">

                            <button
                              type="button"
                              className="management-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  member
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              className="management-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  member.id
                                )
                              }
                            >
                              Delete
                            </button>


                            <button
                              type="button"
                              className="management-move-btn"
                              onClick={() =>
                                handleMoveUp(
                                  index
                                )
                              }
                              disabled={
                                index === 0
                              }
                              title="Move Up"
                            >
                              ↑
                            </button>


                            <button
                              type="button"
                              className="management-move-btn"
                              onClick={() =>
                                handleMoveDown(
                                  index
                                )
                              }
                              disabled={
                                index ===
                                members.length -
                                  1
                              }
                              title="Move Down"
                            >
                              ↓
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ManagementAdmin;