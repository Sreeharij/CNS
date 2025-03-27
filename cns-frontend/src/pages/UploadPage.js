import React, { useState } from "react";
import { db, storage } from "../firebase/config"; // Ensure Firebase is configured
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import "../styles/UploadPage.css"; // Import CSS file

const UploadPage = () => {
  const [formData, setFormData] = useState({
    department: "",
    description: "",
    floor: "",
    lat: "",
    lng: "",
    name: "",
    tags: [],
    image: null,
    imagePath: "", // Stores "locations/filename"
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file, imagePath: `locations/${file.name}` });
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
    }
    setTagInput("");
  };

  const handleUpload = async () => {
    if (!formData.image) {
      alert("Please select an image");
      return;
    }
    setLoading(true);

    try {
      const imageRef = ref(storage, formData.imagePath);
      await uploadBytes(imageRef, formData.image);

      await addDoc(collection(db, "locations"), {
        department: formData.department,
        description: formData.description,
        floor: formData.floor,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        name: formData.name,
        tags: formData.tags,
        imagePath: formData.imagePath, // Storing only "locations/filename"
      });

      alert("Upload successful");
      setFormData({
        department: "",
        description: "",
        floor: "",
        lat: "",
        lng: "",
        name: "",
        tags: [],
        image: null,
        imagePath: "",
      });
    } catch (error) {
      console.error("Error uploading: ", error);
      alert("Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="upload-container">
      <h2 className="title">Upload Location</h2>

      {/* Form Fields */}
      <div className="form-group">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name} />
        <input type="text" name="department" placeholder="Department" onChange={handleChange} value={formData.department} />
        <textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} />
        <input type="text" name="floor" placeholder="Floor" onChange={handleChange} value={formData.floor} />

        <div className="lat-lng">
          <input type="text" name="lat" placeholder="Latitude" onChange={handleChange} value={formData.lat} />
          <input type="text" name="lng" placeholder="Longitude" onChange={handleChange} value={formData.lng} />
        </div>

        <input type="file" onChange={handleFileChange} />
      </div>

      {/* Tags Section */}
      <div className="tags-section">
        <div className="tag-input">
          <input type="text" placeholder="Add tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
          <button onClick={handleTagAdd}>+</button>
        </div>

        <div className="tags-container">
          {formData.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      <button onClick={handleUpload} disabled={loading} className="upload-button">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadPage;
