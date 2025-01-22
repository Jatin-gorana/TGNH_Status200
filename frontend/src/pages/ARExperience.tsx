import React, { useState } from "react";
import axios from "axios";

const ARExperience: React.FC = () => {
  const [imageURL, setImageURL] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [modelData, setModelData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError("Failed to upload image for conversion");
    } finally {
      setLoading(false);
    }
  };

  // const fetchResult = async () => {
  //   if (!taskId) return;
  //   console.log(taskId)
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
  //     setModelData(response.data);
  //     console.log(response.data);
  //   } catch (err) {
  //     setError("Failed to fetch 3D model data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Example polling for task completion
const fetchResult = async () => {
  if (!taskId) return;
  setLoading(true);
  setError(null);

  try {
      // Fetch status
      const response = await axios.get(`http://localhost:5000/api/result/${taskId}`);
      setModelData(response.data);
      console.log(response.data);

      // Check if model is ready, if yes, exit polling loop
      if (response.data.status === 'SUCCEEDED' && response.data.model_urls.glb) {
          clearInterval(pollingInterval);
      }
  } catch (err) {
      setError("Failed to fetch 3D model data");
  } finally {
      setLoading(false);
  }
};

// Set interval for polling every 30 seconds
const pollingInterval = setInterval(fetchResult, 30000);



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Image to 3D Model Converter</h1>

      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Enter image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>

        {taskId && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={fetchResult}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch 3D Model"}
          </button>
        )}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {modelData && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-2">3D Model Links</h2>
          <ul className="list-disc ml-6">
            <li>
              <a href={modelData.model_urls.glb} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                GLB Format
              </a>
            </li>
            <li>
              <a href={modelData.model_urls.fbx} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                FBX Format
              </a>
            </li>
            <li>
              <a href={modelData.model_urls.obj} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                OBJ Format
              </a>
            </li>
            <li>
              <a href={modelData.model_urls.usdz} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                USDZ Format
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ARExperience;











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
//             <div className="inline-flex rounded-lg border border-stone-700 p-1 bg-stone-800">
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
//             </div>
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