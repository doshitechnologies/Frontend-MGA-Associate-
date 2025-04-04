import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import { useMediaQuery } from 'react-responsive';


// import ImageNotFound from "../../imageNotFound.jpg";

import PdfModal from "./PdfModal"; // Import the PdfModal component



const ShowInteriorProject = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingProject, setEditingProject] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [uploadingSection, setUploadingSection] = useState(null);

  const [pdfModalUrl, setPdfModalUrl] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 767 }); // Adjust breakpoint as needed



  const viewPdfInModal = (pdfUrl) => {
    setPdfModalUrl(pdfUrl);
  };

  const closePdfModal = () => {
    setPdfModalUrl(null);
  };


  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/interior/interior/${projectId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }
      const data = await response.json();
      if (!data) {
        setLoading(true);
      }
      setProjectData(data.data);
      setEditingProject(data.data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error("Failed to fetch project data. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/interior/update/interiors/${editingProject._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update project data");
      }
      const data = await response.json();
      setProjectData(data.data);
      setEditingProject(data.data);

      toast.success("Project updated successfully!");
      setEditing(false);
      fetchProjectData();
    } catch (error) {
      console.error("Error updating project data:", error);
      toast.error("Failed to update project. Please try again.");
    }
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleShareImage = (imageUrl) => {
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => {
        toast.success("Image link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy image link.");
      });
  };


  const handleDownloadImage = async (fileUrl, fileName) => {
    const timeout = 5000; // 5 seconds timeout
    let timeoutId;

    toast.promise(
      new Promise(async (resolve, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Download taking too long."));
        }, timeout);

        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          clearTimeout(timeoutId); // Clear timeout if download is successful
          saveAs(blob, fileName);
          resolve();
        } catch (error) {
          clearTimeout(timeoutId); // Clear timeout on fetch error as well
          reject(error);
        }
      }),
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pending: "Downloading...",
        success: "Download complete!",
        error: {
          render({ data }) {
            if (data && data.message === "Download taking too long.") {
              return "File is taking too long to download. Please try again later.";
            }
            return "Download failed. Please try again.";
          },
        },
        finally: () => clearTimeout(timeoutId), // Ensure timeout is cleared on completion/error
      }
    );
  };

  const uploadFileHandler = async (e, sectionName) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setUploadingSection(sectionName);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        `https://projectassociate-fld7.onrender.com/api/auth/upload`,
        formData
      );

      const fileUrl = data.fileUrl;
      if (!fileUrl) {
        setEditingProject({
          ...editingProject,
        });
      }
      setEditingProject({
        ...editingProject,
        [sectionName]: [...editingProject[sectionName], fileUrl],
      });
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed. Please try again.");
    } finally {
      setUploadingSection(null);
    }
  };

  const myMap = new Map([
    ["title", "Title"],
    ["clientName", "Client Name"],
    ["siteAddress", "Site Address"],
    ["gstNo", "GST Number"],
    ["projectHead", "Project Head"],
    ["leadFirm", "Lead Firm"],
    ["rccDesignerName", "RCC Designer Name"],
    ["Aadhar", "Aadhar"],
    ["Pan", "PAN"],
    ["Pin", "Pin"],
    ["email", "Email"],
    ["Presentation_DrawingI", "Presentation Drawing"],
    ["Estimate", "Estimate"],
    ["ThreeD_Model", "3D Model"],
    ["Ceiling", "Ceiling"],
    ["Electrical", "Electrical"],
    ["Plumbing", "Plumbing"],
    ["Flooring", "Flooring"],
    ["Bill", "Bill"],
    ["Site_Photo", "Site Photos"],
    ["Curtains", "Curtains"],
    ["Door_Handle", "Door Handle"],
    ["Hinges", "Hinges"],
    ["Venner", "Venner"],
    ["Laminates", "Laminates"],


    ["Ceiling_Shop", "Shop"],
    ["Ceiling_Ground", "Ground"],
    ["Ceiling_First", "First"],
    ["Ceiling_Second", "Second"],
    ["Ceiling_Third", "Third"],
    ["Ceiling_Fourth", "Fourth"],
    ["Ceiling_Fifth", "Fifth"],
    ["Electrical_Shop", "Shop"],
    ["Electrical_Ground", "Ground"],
    ["Electrical_First", "First"],
    ["Electrical_Second", "Second"],
    ["Electrical_Third", "Third"],
    ["Electrical_Fourth", "Fourth"],
    ["Electrical_Fifth", "Fifth"],
    ["Furniture_Shop", "Shop"],
    ["Furniture_Ground", "Ground"],
    ["Furniture_First", "First"],
    ["Furniture_Second", "Second"],
    ["Furniture_Third", "Third"],
    ["Furniture_Fourth", "Fourth"],
    ["Furniture_Fifth", "Fifth"],
    ["Plumbing_Shop", "Shop"],
    ["Plumbing_Ground", "Ground"],
    ["Plumbing_First", "First"],
    ["Plumbing_Second", "Second"],
    ["Plumbing_Third", "Third"],
    ["Plumbing_Fourth", "Fourth"],
    ["Plumbing_Fifth", "Fifth"],
    ["Flooring", "Flooring"],
    ["Flooring_Shop", "Shop"],
    ["Flooring_Ground", "Ground"],
    ["Flooring_First", "First"],
    ["Flooring_Second", "Second"],
    ["Flooring_Third", "Third"],
    ["Flooring_Fourth", "Fourth"],
    ["Flooring_Fifth", "Fifth"],
  ]);

  const renderSection = (sectionName, fields) => (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer bg-blue-100 px-4 py-3 rounded-lg shadow"
        onClick={() => toggleSection(sectionName)}
      >
        <h3 className="text-xl font-bold text-blue-700">{sectionName}</h3>
        <button>
          {expandedSections[sectionName] ? "▲" : "▼"}
        </button>
      </div>
      {sectionName === "Project Details" ?
        expandedSections[sectionName] && (
          <div className="mt-2 ml-4">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Field</th>
                  <th className="border border-gray-300 px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field} className="text-gray-800">
                    <td className="border border-gray-300 px-4 py-2 font-bold">{myMap.get(field)}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {editing ? (
                        <input
                          type="text"
                          name={field}
                          value={editingProject[field] || ""}
                          onChange={handleChange}
                          className="border p-2 rounded w-full"
                        />
                      ) : (
                        <p>{projectData[field]}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) :
        expandedSections[sectionName] && (
          <div className="mt-2 ml-4">
            {fields.map((field) => (
              <div key={field}>
                {renderFileInputs(field)}
              </div>
            ))}
          </div>
        )}
    </div>
  );

  const renderFileInputs = (sectionName, label) => (
    <div>
      <h3 className="font-bold mb-2 text-2xl">{myMap.get(sectionName)}</h3>
      {editing && (
        <input
          type="file"
          onChange={(e) => uploadFileHandler(e, sectionName)}
          className="text-blue-500 text-sm mb-4"
        />
      )
      }
      {uploadingSection === sectionName && (
        <p className="text-blue-600 font-medium">Uploading...</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(projectData[sectionName] || []).length > 0 ? (
          (projectData[sectionName] || []).map((fileUrl, index) => {
            const fileName = fileUrl.split("/").pop().split("?")[0];

            return (
              <div key={index} className="relative group" style={{ width: '100%', maxWidth: '300px' }}>
                {fileUrl.endsWith(".pdf") ? (
                  <>
                    {isMobile ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => viewPdfInModal(fileUrl)}
                      >
                        <iframe
                          src={fileUrl}
                          width="100%"
                          height="200px"
                          className="border rounded-md pointer-events-none"
                          title={`File ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../../imageNotFound.jpg";
                          }}
                        />
                      </div>
                    ) : (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <iframe
                          src={fileUrl}
                          width="100%"
                          height="200px"
                          className="border rounded-md pointer-events-none"
                          title={`File ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "../../imageNotFound.jpg";
                          }}
                        />
                      </a>
                    )}
                  </>
                ) : (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={fileUrl}
                      alt={`File ${index + 1}`}
                      className="w-full h-60 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "../../imageNotFound.jpg";
                      }}
                    />
                  </a>
                )}


                {isMobile ? <div className="absolute top-2 right-2 flex space-x-2 transition-opacity duration-300">
                  <button
                    onClick={() => handleDownloadImage(fileUrl, fileName)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md"
                    title="Download File"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="8 12 12 16 16 12"></polyline>
                      <line x1="12" y1="16" x2="12" y2="4"></line>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShareImage(fileUrl)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md"
                    title="Share File"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                  </button>
                </div> :
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleDownloadImage(fileUrl, fileName)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md"
                      title="Download File"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="8 12 12 16 16 12"></polyline>
                        <line x1="12" y1="16" x2="12" y2="4"></line>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShareImage(fileUrl)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md"
                      title="Share File"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </button>
                  </div>}
                <p className="text-center mt-2">{decodeURIComponent(fileName)}</p>
              </div>
            );
          })
        ) : (
          <p>No File Present</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* ... (rest of your component rendering) */}
      {pdfModalUrl && isMobile && <PdfModal pdfUrl={pdfModalUrl} onClose={closePdfModal} />}
      <div className="flex justify-end">
        <button
          onClick={() => window.history.back()} // Navigate back in history
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg"
        >
          Back
        </button>
      </div>

      <ToastContainer />

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : projectData ? (
          <div className="space-y-8">
            {renderSection("Project Details", [
              "title",
              "clientName",
              "siteAddress",
              "gstNo",
              "projectHead",
              "leadFirm",
              "Aadhar",
              "Pan",
              "Pin",
              "email",
            ])}
            {renderSection("Presentation Drawing", [
              "Presentation_DrawingI",
            ])}
            {renderSection("Ceiling Detail", [
              "Ceiling_Shop",
              "Ceiling_Ground",
              "Ceiling_First",
              "Ceiling_Second",
              "Ceiling_Third",
              "Ceiling_Fourth",
              "Ceiling_Fifth"
            ])}
            {renderSection("Electrical Layout", [
              "Electrical_Shop",
              "Electrical_Ground",
              "Electrical_First",
              "Electrical_Third",
              "Electrical_Fourth",
              "Electrical_Fifth",
            ])}

            {renderSection("Furniture Details", [
              "Furniture_Shop",
              "Furniture_Ground",
              "Furniture_First",
              "Furniture_Second",
              "Furniture_Third",
              "Furniture_Fourth",
              "Furniture_Fifth"
            ])}
            {renderSection("Plumbing Layout", [
              "Plumbing_Shop",
              "Plumbing_Ground",
              "Plumbing_First",
              "Plumbing_Second",
              "Plumbing_Third",
              "Plumbing_Fourth",
              "Plumbing_Fifth"
            ])}
            {renderSection("3D Model", [
              "ThreeD_Model",
            ])}
            {renderSection("Flooring Layout", [
              "Flooring_Shop",
              "Flooring_Ground",
              "Flooring_First",
              "Flooring_Second",
              "Flooring_Third",
              "Flooring_Fourth",
              "Flooring_Fifth"
            ])}
            {renderSection("Material Selection", [
              "Door_Handle",
              "Curtains",
              "Laminates",
              "Venner",
              "Hinges"
            ])}
            {renderSection("Estimate & Bills", [
              "Estimate",
              "Bill"
            ])}
            {renderSection("Onsite Photos", [
              "Site_Photo",
            ])}

            <div className="flex justify-center space-x-4 mt-4">
              {editing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-6 py-2 rounded-full"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full"
                >
                  Edit Project
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-xl text-gray-500">
            Project Not Found
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowInteriorProject;
