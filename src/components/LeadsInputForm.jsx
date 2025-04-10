import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

// API call to submit a lead
async function submitLead(data) {
  const response = await fetch("https://leadsbackend-vmov.onrender.com/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit lead");
  }

  return await response.json();
}

// API call to delete a lead; uses .text() since backend returns plain text
async function deleteLead(id) {
  const response = await fetch(
    `https://leadsbackend-vmov.onrender.com/leads/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete lead");
  }

  const message = await response.text();
  return message;
}

export default function LeadsInputForm() {
  // Define initial state for the form so we can reset easily
  const initialForm = {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    notes: "",
    deleteId: "",
  };

  const [activeTab, setActiveTab] = useState("input");
  const [form, setForm] = useState(initialForm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("submit");

  // Update form values on change; this works for both the insert & delete inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Called when the input (insert) form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      alert("Name and Email are required.");
      return;
    }

    // Check if email follows a correct format: (xyz@xyz.xyz)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setDialogType("submit");
    setDialogOpen(true);
  };

  // Called when the delete form is submitted
  const handleDelete = (e) => {
    e.preventDefault();
    if (!form.deleteId.trim()) {
      alert("Please enter a valid ID.");
      return;
    }
    setDialogType("delete");
    setDialogOpen(true);
  };

  // Confirmation handler; calls the appropriate API and clears the form if successful.
  const handleConfirm = async () => {
    setDialogOpen(false);
    try {
      if (dialogType === "submit") {
        const res = await submitLead(form);
        console.log("Submitted:", res);
        alert("Lead submitted successfully.");
        // Clear all fields after successful submission
        setForm(initialForm);
      } else if (dialogType === "delete") {
        const res = await deleteLead(form.deleteId);
        console.log("Deleted:", res);
        alert(res);

        setForm((prev) => ({ ...prev, deleteId: "" }));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  // Handler to switch tabs (input or delete) and clear the form when the tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setForm(initialForm);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tab Buttons */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "input"
              ? "text-[#e9316c] border-b-2 border-[#e9316c]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("input")}
        >
          Input Leads
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "delete"
              ? "text-[#e9316c] border-b-2 border-[#e9316c]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("delete")}
        >
          Delete Leads
        </button>
      </div>

      {/* Insert Form */}
      {activeTab === "input" && (
        <>
          <h2 className="text-2xl font-bold">Input Leads</h2>
          <p className="mb-2">Fill the fields with appropriate information</p>
          <hr />
          <form className="my-6" onSubmit={handleSubmit}>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleInputChange}
              className="border-b focus:outline-none focus:border-[#e9316c] focus:border-b-2 transition-colors duration-200 border-gray-300 w-full py-2"
              type="text"
              placeholder="Full Name"
              required
            />
            <div className="flex flex-row justify-between gap-4">
              <input
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="border-b focus:outline-none focus:border-[#e9316c] focus:border-b-2 border-gray-300 w-[95%] py-2 mt-4"
                type="email"
                placeholder="Email"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="border-b focus:outline-none focus:border-[#e9316c] focus:border-b-2 border-gray-300 w-full py-2 mt-4"
                type="tel"
                placeholder="Phone Number"
              />
            </div>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleInputChange}
              className="border-b focus:outline-none focus:border-[#e9316c] focus:border-b-2 border-gray-300 w-full py-2 mt-4"
              type="text"
              placeholder="Company Name"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleInputChange}
              className="border-b focus:outline-none focus:border-[#e9316c] focus:border-b-2 border-gray-300 w-full py-2 mt-4"
              placeholder="Notes"
              rows="1"
            />
            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-[#e9316c] to-[#f05e53] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Submit Lead
              </button>
            </div>
          </form>
        </>
      )}

      {/* Delete Form */}
      {activeTab === "delete" && (
        <>
          <h2 className="text-2xl font-bold">Delete Leads</h2>
          <p className="mb-2">Enter the UUID of the lead you want to delete</p>
          <hr />
          <form className="my-6" onSubmit={handleDelete}>
            <input
              name="deleteId"
              value={form.deleteId}
              onChange={handleInputChange}
              className="border-b focus:outline-none focus:border-[#e9316c] focus:border-b-2 border-gray-300 w-full py-2"
              type="text"
              placeholder="ID"
              required
            />
            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-[#e9316c] to-[#f05e53] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Delete Lead
              </button>
            </div>
          </form>
        </>
      )}

      <ConfirmationDialog
        open={dialogOpen}
        title={dialogType === "submit" ? "Submit Lead?" : "Delete Lead?"}
        message={
          dialogType === "submit"
            ? "Are you sure you want to submit this lead?"
            : `Are you sure you want to delete lead with ID: ${form.deleteId}?`
        }
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
