import { useState } from "react";
import axios from "axios";
import "./Form.css";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    universityId: "",
    department: "",
    contact: "",
    type: "Default",
    projectName: "",
    projectDetails: "",
    message: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/submit-order`, formData);
      window.location.reload();
      alert(res.data.message);
    } catch (err) {
      alert("Submission failed");
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>Submit Project Order</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="input-field"
        required
      />
      <input
        name="universityId"
        placeholder="University ID"
        onChange={handleChange}
        className="input-field"
        required
      />
      <input
        name="department"
        placeholder="Department"
        onChange={handleChange}
        className="input-field"
        required
      />
      <input
        name="contact"
        placeholder="Contact"
        onChange={handleChange}
        className="input-field"
        required
      />

      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="type"
            value="Default"
            checked={formData.type === "Default"}
            onChange={handleChange}
          />
          Default
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="Customised"
            checked={formData.type === "Customised"}
            onChange={handleChange}
          />
          Customised
        </label>
      </div>

      {formData.type === "Default" ? (
        <input
          name="projectName"
          placeholder="Project Name"
          onChange={handleChange}
          className="input-field"
          required
        />
      ) : (
        <textarea
          name="projectDetails"
          placeholder="Project Details"
          onChange={handleChange}
          className="textarea-field"
          required
        />
      )}

      <textarea
        name="message"
        placeholder="Any message (optional)"
        onChange={handleChange}
        className="textarea-field"
      />

      <button type="submit" className="submit-btn">
        Submit
      </button>
    </form>
  );
};

export default Form;
