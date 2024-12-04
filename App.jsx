import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

// hardcode backend responses
const formAPIs = {
  "userInfo": {
    "fields": [
      { "name": "firstName", "type": "text", "label": "First Name", "required": true },
      { "name": "lastName", "type": "text", "label": "Last Name", "required": true },
      { "name": "age", "type": "number", "label": "Age", "required": false }
    ]
  },
  "addressInfo": {
    "fields": [
      { "name": "street", "type": "text", "label": "Street", "required": true },
      { "name": "city", "type": "text", "label": "City", "required": true },
      { "name": "state", "type": "dropdown", "label": "State", "options": ["California", "Texas", "New York"], "required": true },
      { "name": "zipCode", "type": "text", "label": "Zip Code", "required": false }
    ]
  },
  "paymentInfo": {
    "fields": [
      { "name": "cardNumber", "type": "text", "label": "Card Number", "required": true },
      { "name": "expiryDate", "type": "date", "label": "Expiry Date", "required": true },
      { "name": "cvv", "type": "password", "label": "CVV", "required": true },
      { "name": "cardholderName", "type": "text", "label": "Cardholder Name", "required": true }
    ]
  }
};

function DynamicForm() {
  const [selectedForm, setSelectedForm] = useState("userInfo");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  // Handle form selection
  const handleFormChange = (e) => {
    const formType = e.target.value;
    setSelectedForm(formType);
    setFormData({});
    setErrors({});
  };

  // Handle input change
  const handleInputChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });

    // Updating progress bar
    const totalFields = formAPIs[selectedForm].fields.length;
    const filledFields = Object.values(formData).filter((value) => value !== "").length;
    setProgress(Math.floor((filledFields / totalFields) * 100));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = {};
    const fields = formAPIs[selectedForm].fields;

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        formErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSubmittedData([...submittedData, formData]);
    setFormData({});
    setErrors({});
    setProgress(0);
    alert("Form submitted successfully!");
  };

  // Rendering dynamic fields based on the selected form
  const renderFields = () => {
    const fields = formAPIs[selectedForm].fields;

    return fields.map((field, index) => (
      <div className="form-group" key={index}>
        <label>{field.label}</label>
        {field.type === "text" || field.type === "number" || field.type === "password" ? (
          <input
            type={field.type}
            className="form-control"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(e, field.name)}
            required={field.required}
          />
        ) : field.type === "date" ? (
          <input
            type="date"
            className="form-control"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(e, field.name)}
            required={field.required}
          />
        ) : field.type === "dropdown" ? (
          <select
            className="form-control"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(e, field.name)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        ) : null}
        {errors[field.name] && <small className="text-danger">{errors[field.name]}</small>}
      </div>
    ));
  };

  // Rendering table for submitted data
  const renderTable = () => {
    return (
      <div className="mt-4">
        <h4>Submitted Data</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              {Object.keys(formData).map((key, idx) => (
                <th key={idx}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
                <td>
                  <button className="btn btn-info btn-sm mr-2" onClick={() => editEntry(index)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteEntry(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Edit an entry in the table
  const editEntry = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData(submittedData.filter((_, idx) => idx !== index));
  };

  // Delete an entry in the table
  const deleteEntry = (index) => {
    setSubmittedData(submittedData.filter((_, idx) => idx !== index));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Dynamic Form</h2>
      <div className="form-group">
        <label>Select Form Type</label>
        <select className="form-control" value={selectedForm} onChange={handleFormChange}>
          <option value="userInfo">User Information</option>
          <option value="addressInfo">Address Information</option>
          <option value="paymentInfo">Payment Information</option>
        </select>
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderFields()}

        <button type="submit" className="btn btn-success mt-3">Submit</button>
      </form>

      <div className="mt-4">
        <label>Progress: {progress}%</label>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {renderTable()}
    </div>
  );
}

export default DynamicForm;
