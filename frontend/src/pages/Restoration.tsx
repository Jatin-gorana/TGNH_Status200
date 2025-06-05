// Fully working restoration page
import React, { useState } from "react";
import axios from "axios";


const Reconstruction: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [reconstructedImageUrl, setReconstructedImageUrl] = useState<string | null>(null);
  const [colorFlag, setColorFlag] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL for the uploaded image
    }
  };

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("color_flag", colorFlag.toString());

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/reconstruct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReconstructedImageUrl(response.data.data["2k"].url);
    } catch (error) {
      console.error("Error reconstructing image:", error);
      alert("Failed to reconstruct the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">AI-Powered Restoration</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Digitally restore and preserve cultural artifacts
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-stone-50 min-h-screen py-16">
        <div className="max-w-4xl mx-auto bg-white/90 shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-serif text-stone-800 text-center mb-8">Image Reconstruction</h2>
          <div className="mb-6">
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileChange}
              className="border border-stone-300 rounded p-2 w-full"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="text-stone-800 font-medium">Recolor the image?</label>
            <input
              type="checkbox"
              checked={colorFlag}
              onChange={(e) => setColorFlag(e.target.checked)}
              className="w-5 h-5 accent-amber-700"
            />
          </div>
          <button
            onClick={handleSubmit}
            className={`w-full py-3 px-6 bg-amber-700 text-white font-bold rounded hover:bg-amber-800 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Reconstructing..." : "Reconstruct"}
          </button>

          {/* Image Display Section */}
          {(previewUrl || reconstructedImageUrl) && (
            <div className="mt-10 flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Uploaded Image */}
              {previewUrl && (
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Uploaded Image</h3>
                  <div className="w-64 h-64 border border-stone-300 rounded overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Uploaded"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Reconstructed Image */}
              {reconstructedImageUrl && (
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Reconstructed Image</h3>
                  <div className="w-64 h-64 border border-stone-300 rounded overflow-hidden">
                    <img
                      src={reconstructedImageUrl}
                      alt="Reconstructed"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reconstruction;
