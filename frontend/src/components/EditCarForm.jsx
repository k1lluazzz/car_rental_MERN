import React, { useState } from "react";
import axios from "axios";

const EditCarForm = ({ car, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: car.name,
    brand: car.brand,
    pricePerDay: car.pricePerDay,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("pricePerDay", formData.pricePerDay);
    if (formData.image) {
      data.append("image", formData.image); // Append image file
    }

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.put(
        `http://localhost:5000/api/cars/${car._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        }
      );
      alert("Car updated successfully!");
      onUpdate(response.data); // Notify parent component
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update car.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="pricePerDay"
        value={formData.pricePerDay}
        onChange={handleChange}
        required
      />
      <input type="file" name="image" onChange={handleFileChange} />
      <button type="submit">Update Car</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default EditCarForm;
