import { useState, useEffect } from "react";

async function getLeads() {
  const response = await fetch(`https://leadsbackend-vmov.onrender.com/leads`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get leads");
  }

  return await response.json();
}

export default function LeadsInputForm() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const leadsPerPage = 3;

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeads();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }
      setLeads(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const totalPages = Math.ceil(leads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const currentLeads = leads.slice(startIndex, startIndex + leadsPerPage);

  return (
    <>
      <div className="flex flex-row justify-between gap-4 mb-4">
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-bold">Display Leads</h2>
          <p className="mb-2">Displays all the appropriate information</p>
        </div>
        <div className="justify-center items-center flex">
          <button
            type="button"
            className="px-6 py-2 bg-gradient-to-br from-[#e9316c] to-[#f05e53] text-white rounded-md hover:opacity-90 transition-opacity"
            onClick={fetchLeads}
          >
            Refresh
          </button>
        </div>
      </div>
      <hr />

      {loading && <p className="mt-4 text-gray-600">Loading leads...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && !error && leads.length === 0 && (
        <p className="mt-4 text-gray-500">No leads available.</p>
      )}

      {!loading && leads.length > 0 && (
        <>
          <table className="w-full mt-4 border text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">UUID</th>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 border">{lead.id}</td>
                  <td className="px-4 py-2 border">{lead.fullName}</td>
                  <td className="px-4 py-2 border">{lead.email}</td>
                  <td className="px-4 py-2 border">{lead.phone}</td>
                  <td className="px-4 py-2 border">{lead.companyName}</td>
                  <td className="px-4 py-2 border">{lead.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}
