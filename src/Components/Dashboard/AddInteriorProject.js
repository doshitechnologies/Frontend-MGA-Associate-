import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddInteriorProject = ({ isActive, onClick }) => {
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    siteAddress: "",
    gstNo: "",
    projectHead: "",
    leadFirm: "",
    Pan: "",
    Aadhar: "",
    Pin: "",
    email: "",
    documentSections: {
      Presentation_DrawingI: [],
      Ceiling_Shop: [],
      Ceiling_Ground: [],
      Ceiling_First: [],
      Ceiling_Second: [],
      Ceiling_Third: [],
      Ceiling_Fourth: [],
      Ceiling_Fifth: [],
      Electrical_Shop: [],
      Electrical_Ground: [],
      Electrical_First: [],
      Electrical_Second: [],
      Electrical_Third: [],
      Electrical_Fourth: [],
      Electrical_Fifth: [],
      Furniture_Shop: [],
      Furniture_Ground: [],
      Furniture_First: [],
      Furniture_Second: [],
      Furniture_Third: [],
      Furniture_Fourth: [],
      Furniture_Fifth: [],
      Plumbing_Shop: [],
      Plumbing_Ground: [],
      Plumbing_First: [],
      Plumbing_Second: [],
      Plumbing_Third: [],
      Plumbing_Fourth: [],
      Plumbing_Fifth: [],
      ThreeD_Model: [],
      Flooring_Shop: [],
      Flooring_Ground: [],
      Flooring_First: [],
      Flooring_Second: [],
      Flooring_Third: [],
      Flooring_Fourth: [],
      Flooring_Fifth: [],
      Door_Handle: [],
      Curtains: [],
      Laminates: [],
      Venner: [],
      Hinges: [],
      Estimate: [],
      Bill: [],
      Site_Photo: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [uploadingSection, setUploadingSection] = useState(null);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePin = (pin) => /^\d{6}$/.test(pin);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "email" && !validateEmail(value)) {
      newErrors.email = "Invalid email format.";
    } else if (name === "Pin" && !validatePin(value)) {
      newErrors.Pin = "Pin must be exactly 6 digits.";
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFileHandler = async (e, sectionName) => {
    const files = e.target.files;

    if (!files.length) {
      toast.error("Please select files to upload.");
      return;
    }

    setUploadingSection(sectionName);
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const formDataToUpload = new FormData();
          formDataToUpload.append("file", file);

          const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/auth/upload`,
            formDataToUpload
          );

          return data.fileUrl;
        })
      );

      setFormData((prev) => {
        const updatedDocumentSections = {
          ...prev.documentSections,
          [sectionName]: [...(prev.documentSections[sectionName] || []), ...uploadedUrls],
        };

        return {
          ...prev,
          documentSections: updatedDocumentSections,
        };
      });

      toast.success("Files uploaded successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed. Please try again.");
    } finally {
      setUploadingSection(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const transformedObject = {
      ...formData,
      ...formData.documentSections,
    };
    delete transformedObject.documentSections;

    setLoading(true);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/interior/interiors`,
        transformedObject
      );
      toast.success("Interior project added successfully!");

      // Reset the form data *after* the API call
      setFormData({
        title: "",
        clientName: "",
        siteAddress: "",
        gstNo: "",
        projectHead: "",
        leadFirm: "",
        Pan: "",
        Aadhar: "",
        Pin: "",
        email: "",
        documentSections: {
          Presentation_DrawingI: [],
          Ceiling_Shop: [],
          Ceiling_Ground: [],
          Ceiling_First: [],
          Ceiling_Second: [],
          Ceiling_Third: [],
          Ceiling_Fourth: [],
          Ceiling_Fifth: [],
          Electrical_Shop: [],
          Electrical_Ground: [],
          Electrical_First: [],
          Electrical_Second: [],
          Electrical_Third: [],
          Electrical_Fourth: [],
          Electrical_Fifth: [],
          Furniture_Shop: [],
          Furniture_Ground: [],
          Furniture_First: [],
          Furniture_Second: [],
          Furniture_Third: [],
          Furniture_Fourth: [],
          Furniture_Fifth: [],
          Plumbing_Shop: [],
          Plumbing_Ground: [],
          Plumbing_First: [],
          Plumbing_Second: [],
          Plumbing_Third: [],
          Plumbing_Fourth: [],
          Plumbing_Fifth: [],
          ThreeD_Model: [],
          Flooring_Shop: [],
          Flooring_Ground: [],
          Flooring_First: [],
          Flooring_Second: [],
          Flooring_Third: [],
          Flooring_Fourth: [],
          Flooring_Fifth: [],
          Door_Handle: [],
          Curtains: [],
          Laminates: [],
          Venner: [],
          Hinges: [],
          Estimate: [],
          Bill: [],
          Site_Photo: [],
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  const renderFormInput = (label, name, placeholder, type = "text") => (
    <div className="col-span-1">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  const renderFileInputs = (sectionName, label) => {
    const formatLabel = (label) => {
      const newLabel = label.replace(/_/g, " ");
      const words = newLabel.split(" ");
      const lastWord = words[words.length - 1];

      const removableWords = ["Shop", "Ground", "First", "Second", "Third", "Fourth", "Fifth"];

      if (removableWords.includes(lastWord) && words.length > 1) {
        return words.slice(1).join(" ");
      }

      return newLabel;
    };

    return (
      <div className="p-4 bg-blue-100 rounded-lg shadow-md">
        <h3 className="font-semibold text-gray-700 mb-2">{formatLabel(label)}</h3>
        <input
          type="file"
          multiple
          onChange={(e) => uploadFileHandler(e, sectionName)}
          className="text-blue-500 text-sm mb-2 hover:underline"
        />
        {uploadingSection === sectionName && (
          <p className="text-blue-600 font-medium">Uploading...</p>
        )}
        <ul>
          {formData.documentSections[sectionName]?.map((fileUrl, index) => (
            <li
              key={index}
              className="text-sm text-gray-600 truncate flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="p-1 font-semibold">{index + 1}.</span>
                {fileUrl.endsWith(".pdf") ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    View PDF
                  </a>
                ) : (
                  <img
                    src={fileUrl}
                    alt={`Uploaded file ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await axios.delete(
                      `http://localhost:8000/api/auth/file/${encodeURIComponent(fileUrl)}`
                    );
                    setFormData((prevFormData) => {
                      const updatedFiles = [...prevFormData.documentSections[sectionName]];
                      updatedFiles.splice(index, 1);
                      return {
                        ...prevFormData,
                        documentSections: {
                          ...prevFormData.documentSections,
                          [sectionName]: updatedFiles,
                        },
                      };
                    });
                    toast.success("File deleted successfully!");
                  } catch (error) {
                    console.error("Error deleting file:", error);
                    toast.error("Failed to delete file.");
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                &#x2716;
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const documentGroups = [
    { heading: "Presentation", sections: ["Presentation_DrawingI"] },
    { heading: "Ceiling", sections: ["Ceiling_Shop", "Ceiling_Ground", "Ceiling_First", "Ceiling_Second", "Ceiling_Third", "Ceiling_Fourth", "Ceiling_Fifth"] },
    { heading: "Electricals", sections: ["Electrical_Shop", "Electrical_Ground", "Electrical_First", "Electrical_Second", "Electrical_Third", "Electrical_Fourth", "Electrical_Fifth"] },
    { heading: "Furniture Details", sections: ["Furniture_Shop", "Furniture_Ground", "Furniture_First", "Furniture_Second", "Furniture_Third", "Furniture_Fourth", "Furniture_Fifth"] },
    { heading: "Plumbing", sections: ["Plumbing_Shop", "Plumbing_Ground", "Plumbing_First", "Plumbing_Second", "Plumbing_Third", "Plumbing_Fourth", "Plumbing_Fifth"] },
    { heading: "3D Model", sections: ["ThreeD_Model"] },
    { heading: "Flooring", sections: ["Flooring_Shop", "Flooring_Ground", "Flooring_First", "Flooring_Second", "Flooring_Third", "Flooring_Fourth", "Flooring_Fifth"] },
    { heading: "Material Selection", sections: ["Door_Handle", "Curtains", "Laminates", "Venner", "Hinges"] },
    { heading: "Estimates & Bills", sections: ["Estimate", "Bill"] },
    { heading: "Onsite Photos", sections: ["Site_Photo"] },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <button
        className={`w-full p-3 mb-6 rounded-lg transition-all font-semibold text-lg ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        onClick={onClick}
      >
        Add Interior Project
      </button>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Project Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {renderFormInput("Title", "title", "Project Title")}
            {renderFormInput("Client Name", "clientName", "Client Name")}
            {renderFormInput("Site Address", "siteAddress", "Site Address")}
            {renderFormInput("GST No", "gstNo", "GST No")}
            {renderFormInput("Project Head", "projectHead", "Project Head")}
            {renderFormInput("Lead Firm", "leadFirm", "Lead Firm")}
            {renderFormInput("PAN", "Pan", "PAN")}
            {renderFormInput("Aadhar", "Aadhar", "Enter 12-digit Aadhar")}
            {renderFormInput("Pin", "Pin", "Enter 6-digit Pin")}
            {renderFormInput("Email", "email", "Enter your email", "email")}
          </div>
        </div>
        {documentGroups.map((group, index) => (
          <div key={index}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{group.heading}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {group.sections.map((sectionKey) =>
                <div key={sectionKey}>
                  {renderFileInputs(sectionKey, sectionKey.replace(/_/g, " "))}
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className={`w-full p-3 text-lg font-medium rounded-lg text-white bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
};

export default AddInteriorProject;
