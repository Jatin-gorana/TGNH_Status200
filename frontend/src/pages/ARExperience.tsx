// working perfect

import React, { useState, useEffect } from "react";
import axios from "axios";
import "@google/model-viewer"; // Import the model viewer
import { Camera, Compass, Cuboid as Cube, Layers, Upload } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ARExperience: React.FC = () => {
  const [imageURL, setImageURL] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [modelData, setModelData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [popupVideo, setPopupVideo] = useState(null);


  const features = [
        {
          icon: <Camera className="text-amber-700" size={24} />,
          title: '3D Scanning',
          description: 'Scan artifacts to create detailed 3D models for preservation and study'
        },
        {
          icon: <Cube className="text-amber-700" size={24} />,
          title: 'Virtual Display',
          description: 'View artifacts in your space through augmented reality'
        },
        {
          icon: <Compass className="text-amber-700" size={24} />,
          title: 'Historical Context',
          description: 'Experience artifacts in their original historical settings'
        }
      ];
    
      const artifacts = [
        {
          video: 'https://www.youtube.com/embed/Bx2S7JpdOp4?si=48RLgUXiJ6H8cN-x',
          title: 'Taj Mahal',
          period: 'Classical Period',
          available: true
        },
        {
          video: 'https://www.youtube.com/embed/v6kGTbNy5H0?si=gf6SBhB9SU1CXP3X',
          title: 'Ephesus Artifacts',
          period: 'Imperial Rome',
          available: true
        },
        {
          video: 'https://www.youtube.com/embed/VtI9debZPGU?si=eZPb0y77AG9q_id4',
          title: 'Karnak Temple Egypt',
          period: 'Middle Ages',
          available: true
        }
      ];
      

  const handleUpload = async () => {
    if (!imageURL) {
      setError("Please provide an image URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/convert", { image_url: imageURL });
      setTaskId(response.data.taskId);
      setModelData(null);
      setProgress(0); // Reset progress for a new task
    } catch (err: any) {
      setError(
        err.response?.status === 429
          ? "Too many requests. Please try again later."
          : "Failed to upload image for conversion"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async () => {
    if (!taskId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
      setProgress(response.data.progress);

      if (response.data.status === "SUCCEEDED") {
        clearInterval(pollingIntervalId!); // Stop polling when the task is completed
        setModelData(response.data);
        setProgress(100); // Ensure progress shows as 100% on completion
      }
    } catch (err: any) {
      setError("Failed to fetch 3D model data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      // Start polling every 30 seconds
      const intervalId = setInterval(fetchResult, 30000);
      setPollingIntervalId(intervalId);

      return () => clearInterval(intervalId); // Cleanup polling on component unmount
    }
  }, [taskId]);

  const handleGlbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGlbFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">3D & AR Experience</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Step into history with our immersive AR technology. Upload your image and explore 3D models with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <div className="container mx-auto p-8 bg-stone-50 shadow-2xl rounded-xl">
        <div className="mb-6 px-10">
          <input
            type="text"
            className="border border-stone-300 p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 transition duration-300 lg:w-[50%]"
            placeholder="Enter image URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 mb-6 px-10">
          <button
            className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            onClick={handleUpload}
            disabled={loading}
          >
            Upload Image
          </button>

          

          {taskId && (
            <button
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              onClick={fetchResult}
              disabled={loading}
            >
              Generate 3D Model
            </button>
          )}

{imageURL && (
  <div className="mb-6 px-10">
    <img
      src={imageURL}
      alt="Preview"
      className="h-32 w-32 object-contain rounded-lg border border-stone-300 shadow-lg"
    />
  </div>
)}
        </div>

        {progress !== null && progress<100 &&(
          <div className="mb-6">
            <div className="h-4 bg-stone-200 rounded-full overflow-hidden">
            {progress !== null && (
  <div className="mb-6">
    <ProgressBar animated variant="warning" now={progress} />
  </div>
)}
            </div>
            <p className="text-xl text-stone-600 mt-2 text-center">
              Progress: {progress}% {progress === 100 && "✅"}
            </p>
          </div>
        )}

        {error && <div className="text-red-500 mb-6">{error}</div>}

        {modelData && (
          <div className="mt-6 bg-stone-100 p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-semibold mb-4 text-stone-800">3D Model Links</h2>
            <h2 className="text-l font-semibold mb-4 text-stone-800">Download below generated glb file and upload in GLB viewer</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <a
                  href={modelData.model_urls.glb}
                  download
                  className="text-amber-700 underline hover:text-amber-800 transition duration-300"
                >
                  Download 3D GLB File 
                </a>
              </li>
            </ul>
          </div>
        )}

        {/* GLB Viewer */}
        <div className="mt-10 bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-stone-800">GLB Model Viewer</h3>


          {/* <input
            type="file"
            accept=".glb"
            onChange={handleGlbUpload}
            className="mb-6 bg-stone-100 p-3 rounded-lg border border-stone-300 hover:bg-stone-200 transition duration-300"
          /> */}

          <label className="block cursor-pointer">
                    <span className="bg-amber-700 text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-amber-800 transition-colors w-[20%]">
                      <Upload className="mr-2" />
                      Upload GLB file
                    
                    <input
                      type="file"
                      accept=".glb"
                      onChange={handleGlbUpload}
                      className="hidden"
                    />
                    </span>
                  </label>


          {glbFile ? (
            <model-viewer
              src={URL.createObjectURL(glbFile)}
              alt="Preview of the uploaded 3D model"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              style={{ width: "100%", height: "500px" }}
            ></model-viewer>
          ) : (
            <p className="text-stone-600">No GLB file selected. Please upload one to preview.</p>
          )}
        </div>
      </div>


{/* manas section */}
      <section className="py-16 bg-stone-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-serif text-center text-stone-800 mb-12">
             Advanced Features
           </h2>
           <div className="grid md:grid-cols-3 gap-8">
             {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Artifacts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-center text-stone-800 mb-12">
            Available in AR
          </h2>
          <div className="grid md:grid-cols-3 gap-8 space-x-10">

          {/* {artifacts.map((artifact, index) => (
            <div key={index} className="bg-stone-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <iframe
                  src={artifact.video}
                  title={artifact.title}
                  className="w-full h-48"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {artifact.available && (
                  <div className="absolute top-4 right-4 bg-amber-700 text-white text-sm px-3 py-1 rounded-full">
                    AR Ready
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-stone-800 mb-2">{artifact.title}</h3>
                <p className="text-stone-600 mb-4">{artifact.period}</p>
                <button className="w-full bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors">
                  View in AR
                </button>
              </div>
            </div>
          ))} */}


          {/* Render Artifacts */}
      {artifacts.map((artifact, index) => (
        <div
          key={index}
          className="bg-stone-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-4"
        >
          <div className="relative">
            <iframe
              src={artifact.video}
              title={artifact.title}
              className="w-full h-48"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            {artifact.available && (
              <div className="absolute top-4 right-4 bg-amber-700 text-white text-sm px-3 py-1 rounded-full">
                AR Ready
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-serif text-stone-800 mb-2">{artifact.title}</h3>
            <p className="text-stone-600 mb-4">{artifact.period}</p>
            <button
              className="w-full bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
              onClick={() => setPopupVideo(artifact.video)}
            >
              View in AR
            </button>
          </div>
        </div>
      ))}

      {/* Full-Screen Popup */}
      {popupVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative w-11/12 md:w-3/4 lg:w-1/2 bg-white rounded-lg overflow-hidden">
            <button
              className="absolute top-4 right-4 text-black bg-gray-300 hover:bg-gray-400 rounded-full p-2"
              onClick={() => setPopupVideo(null)}
            >
              ✕
            </button>
            <iframe
              src={popupVideo}
              title="Full Screen Video"
              className="w-full h-96"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ARExperience;











// perfect

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "@google/model-viewer"; // Import the model viewer

// const ARExperience: React.FC = () => {
//   const [imageURL, setImageURL] = useState<string>("");
//   const [taskId, setTaskId] = useState<string | null>(null);
//   const [modelData, setModelData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [progress, setProgress] = useState<number | null>(null);
//   const [glbFile, setGlbFile] = useState<File | null>(null);
//   const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

//   const handleUpload = async () => {
//     if (!imageURL) {
//       setError("Please provide an image URL");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/convert", { image_url: imageURL });
//       setTaskId(response.data.taskId);
//       setModelData(null);
//       setProgress(0); // Reset progress for a new task
//     } catch (err: any) {
//       setError(
//         err.response?.status === 429
//           ? "Too many requests. Please try again later."
//           : "Failed to upload image for conversion"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchResult = async () => {
//     if (!taskId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
//       setProgress(response.data.progress);

//       if (response.data.status === "SUCCEEDED") {
//         clearInterval(pollingIntervalId!); // Stop polling when the task is completed
//         setModelData(response.data);
//         setProgress(100); // Ensure progress shows as 100% on completion
//       }
//     } catch (err: any) {
//       setError("Failed to fetch 3D model data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (taskId) {
//       // Start polling every 30 seconds
//       const intervalId = setInterval(fetchResult, 30000);
//       setPollingIntervalId(intervalId);

//       return () => clearInterval(intervalId); // Cleanup polling on component unmount
//     }
//   }, [taskId]);

//   const handleGlbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setGlbFile(e.target.files[0]);
//     }
//   };

//   return (
//     <div className="bg-stone-50 min-h-screen text-stone-800">
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6">3D & AR Experience</h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Step into history with our immersive AR technology.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Main Section */}
//       <div className="container mx-auto p-6 bg-stone-50 shadow-lg rounded-lg">
//         <div className="mb-4">
//           <input
//             type="text"
//             className="border border-stone-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
//             placeholder="Enter image URL"
//             value={imageURL}
//             onChange={(e) => setImageURL(e.target.value)}
//           />
//         </div>

//         <div className="flex items-center gap-4 mb-4">
//           <button
//             className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg shadow-md"
//             onClick={handleUpload}
//             disabled={loading}
//           >
//             Upload Image
//           </button>

//           {taskId && (
//             <button
//               className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded-lg shadow-md"
//               onClick={fetchResult}
//               disabled={loading}
//             >
//               Fetch 3D Model
//             </button>
//           )}
//         </div>

//         {progress !== null && (
//           <div className="mb-4">
//             <div className="h-4 bg-stone-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-amber-700 transition-all"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//             <p className="text-sm text-stone-600 mt-2">
//               Progress: {progress}% {progress === 100 && "✅"}
//             </p>
//           </div>
//         )}

//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         {modelData && (
//           <div className="mt-4 bg-stone-100 p-4 rounded-lg shadow">
//             <h2 className="text-2xl font-semibold mb-2 text-stone-800">3D Model Links</h2>
//             <ul className="list-disc ml-6">
//               <li>
//                 <a
//                   href={modelData.model_urls.glb}
//                   download
//                   className="text-amber-700 underline hover:text-amber-800"
//                 >
//                   Download 3D GLB File
//                 </a>
//               </li>
//             </ul>
//           </div>
//         )}

//         {/* GLB Viewer */}
//         <div className="mt-8 bg-white/90 p-6 rounded-lg shadow">
//           <h3 className="text-xl font-semibold mb-4 text-stone-800">GLB Viewer</h3>
//           <input
//             type="file"
//             accept=".glb"
//             onChange={handleGlbUpload}
//             className="mb-4 bg-stone-100 p-2 rounded-lg border border-stone-300"
//           />
//           {glbFile ? (
//             <model-viewer
//               src={URL.createObjectURL(glbFile)}
//               alt="Preview of the uploaded 3D model"
//               camera-controls
//               auto-rotate
//               shadow-intensity="1"
//               style={{ width: "100%", height: "500px" }}
//             ></model-viewer>
//           ) : (
//             <p className="text-stone-600">No GLB file selected. Please upload one to preview.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ARExperience;











// UI bhi thik hai working hai fully

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "@google/model-viewer"; // Import the model viewer

// const ARExperience: React.FC = () => {
//   const [imageURL, setImageURL] = useState<string>("");
//   const [taskId, setTaskId] = useState<string | null>(null);
//   const [modelData, setModelData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [progress, setProgress] = useState<number | null>(null);
//   const [glbFile, setGlbFile] = useState<File | null>(null);
//   const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

//   const handleUpload = async () => {
//     if (!imageURL) {
//       setError("Please provide an image URL");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/convert", { image_url: imageURL });
//       setTaskId(response.data.taskId);
//       setModelData(null);
//       setProgress(0); // Reset progress for a new task
//     } catch (err: any) {
//       setError(
//         err.response?.status === 429
//           ? "Too many requests. Please try again later."
//           : "Failed to upload image for conversion"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchResult = async () => {
//     if (!taskId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
//       setProgress(response.data.progress);

//       if (response.data.status === "SUCCEEDED") {
//         clearInterval(pollingIntervalId!); // Stop polling when the task is completed
//         setModelData(response.data);
//         setProgress(100); // Ensure progress shows as 100% on completion
//       }
//     } catch (err: any) {
//       setError("Failed to fetch 3D model data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (taskId) {
//       // Start polling every 30 seconds
//       const intervalId = setInterval(fetchResult, 30000);
//       setPollingIntervalId(intervalId);

//       return () => clearInterval(intervalId); // Cleanup polling on component unmount
//     }
//   }, [taskId]);

//   const handleGlbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setGlbFile(e.target.files[0]);
//     }
//   };

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6">AR Experience</h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Step into history with our immersive AR technology.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Main Section */}
//       <div className="container mx-auto p-6 bg-stone-100">
//         <div className="mb-4">
//           <input
//             type="text"
//             className="border p-2 w-full rounded"
//             placeholder="Enter image URL"
//             value={imageURL}
//             onChange={(e) => setImageURL(e.target.value)}
//           />
//         </div>

//         <div className="flex items-center gap-4 mb-4">
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={handleUpload}
//             disabled={loading}
//           >
//             Upload Image
//           </button>

//           {taskId && (
//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded"
//               onClick={fetchResult}
//               disabled={loading}
//             >
//               Fetch 3D Model
//             </button>
//           )}
//         </div>

//         {progress !== null && (
//           <div className="mb-4">
//             <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-blue-500 transition-all"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//             <p className="text-sm text-gray-600 mt-2">
//               Progress: {progress}% {progress === 100 && "✅"}
//             </p>
//           </div>
//         )}

//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         {modelData && (
//           <div className="mt-4">
//             <h2 className="text-2xl font-semibold mb-2">3D Model Links</h2>
//             <ul className="list-disc ml-6">
//               <li>
//                 <a
//                   href={modelData.model_urls.glb}
//                   download
//                   className="text-blue-500 underline"
//                 >
//                   Download 3D GLB File
//                 </a>
//               </li>
//             </ul>
//           </div>
//         )}

//         {/* GLB Viewer */}
//         <div className="mt-8 bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold mb-4">GLB Viewer</h3>
//           <input
//             type="file"
//             accept=".glb"
//             onChange={handleGlbUpload}
//             className="mb-4"
//           />
//           {glbFile ? (
//             <model-viewer
//               src={URL.createObjectURL(glbFile)}
//               alt="Preview of the uploaded 3D model"
//               camera-controls
//               auto-rotate
//               shadow-intensity="1"
//               style={{ width: "100%", height: "500px" }}
//             ></model-viewer>
//           ) : (
//             <p className="text-gray-700">No GLB file selected. Please upload one to preview.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ARExperience;














// glb viewer nhi hai par sab sahi hai

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ARExperience: React.FC = () => {
//   const [imageURL, setImageURL] = useState<string>("");
//   const [taskId, setTaskId] = useState<string | null>(null);
//   const [modelData, setModelData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [progress, setProgress] = useState<number | null>(null);
//   const [glbFile, setGlbFile] = useState<File | null>(null);
//   const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

//   const handleUpload = async () => {
//     if (!imageURL) {
//       setError("Please provide an image URL");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/convert", { image_url: imageURL });
//       setTaskId(response.data.taskId);
//       setModelData(null);
//       setProgress(0); // Reset progress for a new task
//     } catch (err: any) {
//       setError(err.response?.status === 429 
//         ? "Too many requests. Please try again later." 
//         : "Failed to upload image for conversion");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchResult = async () => {
//     if (!taskId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
//       setProgress(response.data.progress);

//       if (response.data.status === "SUCCEEDED") {
//         clearInterval(pollingIntervalId!); // Stop polling when the task is completed
//         setModelData(response.data);
//         setProgress(100); // Ensure progress shows as 100% on completion
//       }
//     } catch (err: any) {
//       setError("Failed to fetch 3D model data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (taskId) {
//       // Start polling every 30 seconds
//       const intervalId = setInterval(fetchResult, 30000);
//       setPollingIntervalId(intervalId);

//       return () => clearInterval(intervalId); // Cleanup polling on component unmount
//     }
//   }, [taskId]);

//   const handleGlbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setGlbFile(e.target.files[0]);
//     }
//   };

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6">AR Experience</h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Step into history with our immersive AR technology
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Main Section */}
//       <div className="container mx-auto p-6 bg-stone-100">
//         <div className="mb-4">
//           <input
//             type="text"
//             className="border p-2 w-full rounded"
//             placeholder="Enter image URL"
//             value={imageURL}
//             onChange={(e) => setImageURL(e.target.value)}
//           />
//         </div>

//         <div className="flex items-center gap-4 mb-4">
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={handleUpload}
//             disabled={loading}
//           >
//             {"Upload Image"}
//           </button>

//           {taskId && (
//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded"
//               onClick={fetchResult}
//               disabled={loading}
//             >
//               {"Fetch 3D Model"}
//             </button>
//           )}
//         </div>

//         {progress !== null && (
//           <div className="mb-4">
//             <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-blue-500 transition-all"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//             <p className="text-sm text-gray-600 mt-2">
//               Progress: {progress}% {progress === 100 && "✅"}
//             </p>
//           </div>
//         )}

//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         {modelData && (
//           <div className="mt-4">
//             <h2 className="text-2xl font-semibold mb-2">3D Model Links</h2>
//             <ul className="list-disc ml-6">
//               <li>
//                 <a
//                   href={modelData.model_urls.glb}
//                   download
//                   className="text-blue-500 underline"
//                 >
//                   Download 3D GLB File
//                 </a>
//               </li>
//             </ul>
//           </div>
//         )}

//         {/* GLB Viewer */}
//         <div className="mt-8 bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold mb-4">GLB Viewer</h3>
//           <input
//             type="file"
//             accept=".glb"
//             onChange={handleGlbUpload}
//             className="mb-4"
//           />
//           {glbFile && (
//             <div className="viewer">
//               {/* Replace with an actual GLB Viewer like Three.js */}
//               <p className="text-gray-700">Previewing: {glbFile.name}</p>
//               {/* You can integrate Three.js or Babylon.js for rendering */}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ARExperience;











// perfectly running but no good ui

// import React, { useState } from "react";
// import axios from "axios";

// const ARExperience: React.FC = () => {
//   const [imageURL, setImageURL] = useState<string>("");
//   const [taskId, setTaskId] = useState<string | null>(null);
//   const [modelData, setModelData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleUpload = async () => {
//     if (!imageURL) {
//       setError("Please provide an image URL");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/convert", { image_url: imageURL });
//       setTaskId(response.data.taskId);
//       setModelData(null);
//     } catch (err) {
//       setError("Failed to upload image for conversion");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchResult = async () => {
//   //   if (!taskId) return;
//   //   console.log(taskId)
//   //   setLoading(true);
//   //   setError(null);

//   //   try {
//   //     const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
//   //     setModelData(response.data);
//   //     console.log(response.data);
//   //   } catch (err) {
//   //     setError("Failed to fetch 3D model data");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Example polling for task completion
// const fetchResult = async () => {
//   if (!taskId) return;
//   setLoading(true);
//   setError(null);

//   try {
//       // Fetch status
//       const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
//       setModelData(response.data);
//       console.log(response.data);

//       // Check if model is ready, if yes, exit polling loop
//       if (response.data.status === 'SUCCEEDED') {
//           clearInterval(pollingInterval);
//       }
//   } catch (err) {
//       setError("Failed to fetch 3D model data");
//   } finally {
//       setLoading(false);
//   }
// };

// // Set interval for polling every 30 seconds
// const pollingInterval = setInterval(fetchResult, 30000);



//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Image to 3D Model Converter</h1>

//       <div className="mb-4">
//         <input
//           type="text"
//           className="border p-2 w-full"
//           placeholder="Enter image URL"
//           value={imageURL}
//           onChange={(e) => setImageURL(e.target.value)}
//         />
//       </div>

//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//           onClick={handleUpload}
//           disabled={loading}
//         >
//           {loading ? "Uploading..." : "Upload Image"}
//         </button>

//         {taskId && (
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded"
//             onClick={fetchResult}
//             disabled={loading}
//           >
//             {loading ? "Fetching..." : "Fetch 3D Model"}
//           </button>
//         )}
//       </div>

//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       {modelData && (
//         <div className="mt-4">
//           <h2 className="text-2xl font-semibold mb-2">3D Model Links</h2>
//           <ul className="list-disc ml-6">
//             <li>
//               <a href={modelData.model_urls.glb} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                 GLB Format
//               </a>
//             </li>
//             <li>
//               <a href={modelData.model_urls.fbx} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                 FBX Format
//               </a>
//             </li>
//             <li>
//               <a href={modelData.model_urls.obj} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                 OBJ Format
//               </a>
//             </li>
//             <li>
//               <a href={modelData.model_urls.usdz} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                 USDZ Format
//               </a>
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ARExperience;











// import React, { useState } from 'react';
// import { Camera, Compass, Cuboid as Cube, Layers } from 'lucide-react';

// function ARExperience() {
//   const [selectedMode, setSelectedMode] = useState<'view' | 'explore'>('view');

//   const features = [
//     {
//       icon: <Camera className="text-amber-700" size={24} />,
//       title: '3D Scanning',
//       description: 'Scan artifacts to create detailed 3D models for preservation and study'
//     },
//     {
//       icon: <Cube className="text-amber-700" size={24} />,
//       title: 'Virtual Display',
//       description: 'View artifacts in your space through augmented reality'
//     },
//     {
//       icon: <Compass className="text-amber-700" size={24} />,
//       title: 'Historical Context',
//       description: 'Experience artifacts in their original historical settings'
//     }
//   ];

//   const artifacts = [
//     {
//       image: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?ixlib=rb-4.0.3',
//       title: 'Greek Vase',
//       period: 'Classical Period',
//       available: true
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1608376630927-31d5c5e636c1?ixlib=rb-4.0.3',
//       title: 'Roman Statue',
//       period: 'Imperial Rome',
//       available: true
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3',
//       title: 'Medieval Armor',
//       period: 'Middle Ages',
//       available: true
//     }
//   ];

//   return (
//     <div className="pt-16">
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6">AR Experience</h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Step into history with our immersive AR technology
//             </p>
//            {/* <div className="inline-flex rounded-lg border border-stone-700 p-1 bg-stone-800">
//               <button
//                 className={`px-6 py-2 rounded-md transition-colors ${
//                   selectedMode === 'view'
//                     ? 'bg-amber-700 text-white'
//                     : 'text-stone-400 hover:text-white'
//                 }`}
//                 onClick={() => setSelectedMode('view')}
//               >
//                 View Mode
//               </button>
//               <button
//                 className={`px-6 py-2 rounded-md transition-colors ${
//                   selectedMode === 'explore'
//                     ? 'bg-amber-700 text-white'
//                     : 'text-stone-400 hover:text-white'
//                 }`}
//                 onClick={() => setSelectedMode('explore')}
//               >
//                 Explore Mode
//               </button>
//             </div> */}
//           </div>
//         </div>
//       </section>

//       {/* AR Viewer */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="aspect-video bg-stone-100 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <Camera className="mx-auto text-stone-400 mb-4" size={48} />
//               <p className="text-stone-600">
//                 {selectedMode === 'view' 
//                   ? 'Point your camera at a flat surface to place artifacts'
//                   : 'Scan an artifact to create a 3D model'
//                 }
//               </p>
//               <button className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors">
//                 {selectedMode === 'view' ? 'Start AR View' : 'Start Scanning'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-16 bg-stone-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="mb-4">{feature.icon}</div>
//                 <h3 className="text-xl font-serif text-stone-800 mb-2">{feature.title}</h3>
//                 <p className="text-stone-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Available Artifacts */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-serif text-center text-stone-800 mb-12">
//             Available in AR
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {artifacts.map((artifact, index) => (
//               <div key={index} className="bg-stone-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
//                 <div className="relative">
//                   <img
//                     src={artifact.image}
//                     alt={artifact.title}
//                     className="w-full h-48 object-cover"
//                   />
//                   {artifact.available && (
//                     <div className="absolute top-4 right-4 bg-amber-700 text-white text-sm px-3 py-1 rounded-full">
//                       AR Ready
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-serif text-stone-800 mb-2">{artifact.title}</h3>
//                   <p className="text-stone-600">{artifact.period}</p>
//                   <button className="mt-4 w-full bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors">
//                     View in AR
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default ARExperience;