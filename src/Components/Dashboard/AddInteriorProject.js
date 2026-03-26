import React, { useState, useCallback, useRef, useEffect } from "react";
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
  const [uploadingSections, setUploadingSections] = useState({});
  const [errors, setErrors] = useState({});
  const fileInputRefs = useRef({});
  const uploadTimeoutRef = useRef({});
  const toastIdRef = useRef(null);

  // Clear toasts on unmount
  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      Object.keys(uploadTimeoutRef.current).forEach((key) => {
        if (uploadTimeoutRef.current[key]) {
          clearTimeout(uploadTimeoutRef.current[key]);
        }
      });
    };
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePin = (pin) => /^\d{6}$/.test(pin);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "email" && value && !validateEmail(value)) {
        newErrors.email = "Invalid email format.";
      } else if (name === "Pin" && value && !validatePin(value)) {
        newErrors.Pin = "Pin must be exactly 6 digits.";
      } else if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    // Dismiss previous toast to prevent stacking
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    // Show new toast
    toastIdRef.current = toast[type](message, {
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const uploadFileHandler = useCallback(
    async (e, sectionName) => {
      const files = Array.from(e.target.files);

      if (!files.length) {
        showToast("Please select files to upload.", "error");
        return;
      }

      // Clear any pending timeout for this section
      if (uploadTimeoutRef.current[sectionName]) {
        clearTimeout(uploadTimeoutRef.current[sectionName]);
      }

      setUploadingSections((prev) => ({ ...prev, [sectionName]: true }));

      try {
        const uploadedUrls = [];

        // Upload files one by one with small delay to prevent race conditions
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formDataToUpload = new FormData();
          formDataToUpload.append("file", file);

          const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/auth/upload`,
            formDataToUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          if (data && data.fileUrl) {
            uploadedUrls.push(data.fileUrl);
          }
        }

        if (uploadedUrls.length > 0) {
          // Batch update state
          setFormData((prev) => {
            const existingFiles = prev.documentSections[sectionName] || [];
            const updatedFiles = [...existingFiles, ...uploadedUrls];

            return {
              ...prev,
              documentSections: {
                ...prev.documentSections,
                [sectionName]: updatedFiles,
              },
            };
          });

          // Show success message with delay to prevent double toast
          uploadTimeoutRef.current[sectionName] = setTimeout(() => {
            showToast(
              `${uploadedUrls.length} file(s) uploaded successfully!`,
              "success",
            );
          }, 100);
        }
      } catch (error) {
        console.error("File upload failed:", error);
        showToast("File upload failed. Please try again.", "error");
      } finally {
        setUploadingSections((prev) => ({ ...prev, [sectionName]: false }));

        // Clear the file input
        if (fileInputRefs.current[sectionName]) {
          fileInputRefs.current[sectionName].value = "";
        }

        // Clear timeout
        if (uploadTimeoutRef.current[sectionName]) {
          clearTimeout(uploadTimeoutRef.current[sectionName]);
        }
      }
    },
    [showToast],
  );

  const handleDeleteFile = useCallback(
    async (sectionName, index, fileUrl) => {
      try {
        await axios.delete(
          `https://projectassociate-fld7.onrender.com/api/auth/file/${encodeURIComponent(fileUrl)}`,
        );

        setFormData((prev) => {
          const updatedFiles = [...prev.documentSections[sectionName]];
          updatedFiles.splice(index, 1);

          return {
            ...prev,
            documentSections: {
              ...prev.documentSections,
              [sectionName]: updatedFiles,
            },
          };
        });

        showToast("File deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting file:", error);
        showToast("Failed to delete file.", "error");
      }
    },
    [showToast],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if any uploads are in progress
      if (Object.values(uploadingSections).some((isUploading) => isUploading)) {
        showToast(
          "Please wait for all files to finish uploading before submitting.",
          "error",
        );
        return;
      }

      // Validate required fields
      const requiredFields = [
        "title",
        "clientName",
        "siteAddress",
        "email",
        "Pin",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        showToast(
          `Please fill in all required fields: ${missingFields.join(", ")}`,
          "error",
        );
        return;
      }

      if (Object.keys(errors).length > 0) {
        showToast("Please fix the errors before submitting.", "error");
        return;
      }

      const transformedObject = {
        ...formData,
        ...formData.documentSections,
      };
      delete transformedObject.documentSections;

      setLoading(true);

      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/interior/interiors`,
          transformedObject,
        );

        showToast("Interior project added successfully!", "success");

        // Reset the form data
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
        setErrors({});

        // Reset all file inputs
        Object.keys(fileInputRefs.current).forEach((key) => {
          if (fileInputRefs.current[key]) {
            fileInputRefs.current[key].value = "";
          }
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        showToast(
          "Error submitting form: " +
            (error.response?.data?.message || error.message),
          "error",
        );
      } finally {
        setLoading(false);
      }
    },
    [formData, errors, uploadingSections, showToast],
  );

  const formatLabel = useCallback((label) => {
    const newLabel = label.replace(/_/g, " ");
    const words = newLabel.split(" ");
    const lastWord = words[words.length - 1];

    const removableWords = [
      "Shop",
      "Ground",
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
    ];

    if (removableWords.includes(lastWord) && words.length > 1) {
      return words.slice(0, -1).join(" ");
    }

    return newLabel;
  }, []);

  const renderFormInput = useCallback(
    (label, name, placeholder, type = "text", required = false) => (
      <div className="col-span-1" key={name}>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name] || ""}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        {errors[name] && (
          <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    ),
    [formData, errors, handleInputChange],
  );

  const renderFileInputs = useCallback(
    (sectionName, label) => {
      const isUploading = uploadingSections[sectionName];
      const files = formData.documentSections[sectionName] || [];

      return (
        <div className="p-4 bg-blue-100 rounded-lg shadow-md" key={sectionName}>
          <h3 className="font-semibold text-gray-700 mb-2">
            {formatLabel(label)}
          </h3>
          <input
            ref={(el) => {
              if (el) fileInputRefs.current[sectionName] = el;
            }}
            type="file"
            multiple
            onChange={(e) => {
              // Prevent multiple rapid changes
              if (uploadingSections[sectionName]) return;
              uploadFileHandler(e, sectionName);
            }}
            className="text-blue-500 text-sm mb-2 hover:underline cursor-pointer"
            disabled={isUploading}
          />
          {isUploading && (
            <p className="text-blue-600 font-medium animate-pulse">
              Uploading...
            </p>
          )}
          <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {files.map((fileUrl, index) => (
              <li
                key={`${sectionName}-${index}-${fileUrl.substring(fileUrl.length - 20)}`}
                className="text-sm text-gray-600 truncate flex items-center justify-between bg-white p-2 rounded"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="font-semibold flex-shrink-0">
                    {index + 1}.
                  </span>
                  {fileUrl && fileUrl.endsWith(".pdf") ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline truncate"
                    >
                      View PDF
                    </a>
                  ) : (
                    fileUrl && (
                      <img
                        src={fileUrl}
                        alt={`Uploaded file ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/64?text=Error";
                        }}
                      />
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFile(sectionName, index, fileUrl)}
                  className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                  aria-label="Delete file"
                >
                  &#x2716;
                </button>
              </li>
            ))}
          </ul>
          {files.length === 0 && !isUploading && (
            <p className="text-gray-500 text-sm mt-2">No files uploaded</p>
          )}
        </div>
      );
    },
    [
      formData.documentSections,
      uploadingSections,
      uploadFileHandler,
      handleDeleteFile,
      formatLabel,
    ],
  );

  const documentGroups = [
    { heading: "Presentation", sections: ["Presentation_DrawingI"] },
    {
      heading: "Ceiling",
      sections: [
        "Ceiling_Shop",
        "Ceiling_Ground",
        "Ceiling_First",
        "Ceiling_Second",
        "Ceiling_Third",
        "Ceiling_Fourth",
        "Ceiling_Fifth",
      ],
    },
    {
      heading: "Electricals",
      sections: [
        "Electrical_Shop",
        "Electrical_Ground",
        "Electrical_First",
        "Electrical_Second",
        "Electrical_Third",
        "Electrical_Fourth",
        "Electrical_Fifth",
      ],
    },
    {
      heading: "Furniture Details",
      sections: [
        "Furniture_Shop",
        "Furniture_Ground",
        "Furniture_First",
        "Furniture_Second",
        "Furniture_Third",
        "Furniture_Fourth",
        "Furniture_Fifth",
      ],
    },
    {
      heading: "Plumbing",
      sections: [
        "Plumbing_Shop",
        "Plumbing_Ground",
        "Plumbing_First",
        "Plumbing_Second",
        "Plumbing_Third",
        "Plumbing_Fourth",
        "Plumbing_Fifth",
      ],
    },
    { heading: "3D Model", sections: ["ThreeD_Model"] },
    {
      heading: "Flooring",
      sections: [
        "Flooring_Shop",
        "Flooring_Ground",
        "Flooring_First",
        "Flooring_Second",
        "Flooring_Third",
        "Flooring_Fourth",
        "Flooring_Fifth",
      ],
    },
    {
      heading: "Material Selection",
      sections: ["Door_Handle", "Curtains", "Laminates", "Venner", "Hinges"],
    },
    { heading: "Estimates & Bills", sections: ["Estimate", "Bill"] },
    { heading: "Onsite Photos", sections: ["Site_Photo"] },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
      <button
        type="button"
        className={`w-full p-3 mb-6 rounded-lg transition-all font-semibold text-lg ${
          isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
        }`}
        onClick={onClick}
      >
        Add Interior Project
      </button>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Project Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {renderFormInput("Title", "title", "Project Title", "text", true)}
            {renderFormInput(
              "Client Name",
              "clientName",
              "Client Name",
              "text",
              true,
            )}
            {renderFormInput(
              "Site Address",
              "siteAddress",
              "Site Address",
              "text",
              true,
            )}
            {renderFormInput("GST No", "gstNo", "GST No")}
            {renderFormInput("Project Head", "projectHead", "Project Head")}
            {renderFormInput("Lead Firm", "leadFirm", "Lead Firm")}
            {renderFormInput("PAN", "Pan", "PAN")}
            {renderFormInput("Aadhar", "Aadhar", "Enter 12-digit Aadhar")}
            {renderFormInput("Pin", "Pin", "Enter 6-digit Pin", "text", true)}
            {renderFormInput(
              "Email",
              "email",
              "Enter your email",
              "email",
              true,
            )}
          </div>
        </div>

        {documentGroups.map((group) => (
          <div key={group.heading} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              {group.heading}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {group.sections.map((sectionKey) => (
                <React.Fragment key={sectionKey}>
                  {renderFileInputs(sectionKey, sectionKey.replace(/_/g, " "))}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className={`w-full p-3 text-lg font-medium rounded-lg text-white bg-blue-600 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700 transition-colors"
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
