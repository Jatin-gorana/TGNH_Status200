import React, { useState, ChangeEvent } from "react";
import { FaInfoCircle, FaUpload, FaSpinner, FaTrash } from "react-icons/fa";

const DiscoverArtifact: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setError("Error processing the image.");
      }
    } catch (error) {
      setError("An error occurred while analyzing the image.");
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (result: string | null) => {
    if (!result) return null;

    const sanitizedResult = result.replace(/\*/g, "");
    const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line) => {
      const [key, ...valueParts] = line.split(":");
      return { key: key.trim(), value: valueParts.join(":").trim() };
    });
  };

  const structuredResult = parseResult(result);

  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((i) => i !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">Discover Artifacts</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Upload images of artifacts to unlock their history using our advanced AI recognition technology.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-12 text-center">
              {image ? (
                <div className="space-y-4">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-h-64 mx-auto"
                  />
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className={`bg-amber-700 text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-amber-800 transition-colors ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading && (
                        <FaSpinner className="animate-spin mr-2 text-white" />
                      )}
                      {loading ? "Analyzing..." : "Analyze Artifact"}
                    </button>
                    <button
                      onClick={handleRemoveImage}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash className="" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block cursor-pointer">
                    <span className="bg-amber-700 text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-amber-800 transition-colors">
                      <FaUpload className="mr-2" />
                      Upload Artifact Image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="mt-2 text-sm text-stone-500">
                    Supported formats: JPG
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {/* {structuredResult && (
        <section className="py-16 bg-stone-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif mb-8 text-center">
              Analysis Result
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {structuredResult.map((item, index) => {
                const isExpanded = expandedItems.includes(index);
                const words = item.value.split(" ");
                const isLongText = words.length > 60;
                const previewText = words.slice(0, 60).join(" ");

                return (
                  <div
                    key={index}
                    className="bg-stone-800 p-6 rounded-lg shadow-lg flex flex-col items-start space-y-4"
                  >
                    <div className="flex items-start space-x-4">
                      <FaInfoCircle className="text-amber-500 text-2xl flex-shrink-0" />
                      <h3 className="text-lg font-semibold">{item.key}</h3>
                    </div>
                    <p className="text-stone-300">
                      {isExpanded || !isLongText ? item.value : `${previewText}...`}
                    </p>
                    {isLongText && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="text-amber-500 text-sm font-semibold focus:outline-none"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )} */}


{structuredResult && (
  <section className="py-16 bg-stone-900 text-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-serif mb-8 text-center">
        Analysis Result
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {structuredResult
          .filter((item) => item.value.trim() !== "") // Filter out empty boxes
          .map((item, index) => {
            const isExpanded = expandedItems.includes(index);
            const words = item.value.split(" ");
            const isLongText = words.length > 60;
            const previewText = words.slice(0, 60).join(" ");

            return (
              <div
                key={index}
                className="bg-stone-800 p-6 rounded-lg shadow-lg flex flex-col items-start space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <FaInfoCircle className="text-amber-500 text-2xl flex-shrink-0" />
                  <h3 className="text-lg font-semibold">{item.key}</h3>
                </div>
                <p className="text-stone-300">
                  {isExpanded || !isLongText ? item.value : `${previewText}...`}
                </p>
                {isLongText && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="text-amber-500 text-sm font-semibold focus:outline-none"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  </section>
)}

      {error && (
        <div className="bg-red-500 text-white text-center py-4 mt-4">
          {error}
        </div>
      )}
    </>
  );
};

export default DiscoverArtifact;













// before changing some animation and icons sab sahi tha

// import React, { useState, ChangeEvent } from "react";
// import { FaInfoCircle } from "react-icons/fa";

// const DiscoverArtifact: React.FC = () => {
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!image) {
//       alert("Please upload an image first.");
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setResult(data.result);
//       } else {
//         setError("Error processing the image.");
//       }
//     } catch (error) {
//       setError("An error occurred while analyzing the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const parseResult = (result: string | null) => {
//     if (!result) return null;

//     const sanitizedResult = result.replace(/\*/g, "");
//     const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

//     return lines.map((line) => {
//       const [key, ...valueParts] = line.split(":");
//       return { key: key.trim(), value: valueParts.join(":").trim() };
//     });
//   };

//   const structuredResult = parseResult(result);

//   const [expandedItems, setExpandedItems] = useState<number[]>([]);

//   const toggleExpand = (index: number) => {
//     if (expandedItems.includes(index)) {
//       setExpandedItems(expandedItems.filter((i) => i !== index));
//     } else {
//       setExpandedItems([...expandedItems, index]);
//     }
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6">Discover Artifacts</h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Upload images of artifacts to unlock their history using our advanced AI recognition technology.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Upload Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl mx-auto">
//             <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-12 text-center">
//               {image ? (
//                 <div className="space-y-4">
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt="Preview"
//                     className="max-h-64 mx-auto"
//                   />
//                   <button
//                     onClick={handleAnalyze}
//                     disabled={loading}
//                     className={`bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors ${
//                       loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {loading ? "Analyzing..." : "Analyze Artifact"}
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block">
//                     <span className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors cursor-pointer">
//                       Upload Artifact Image
//                     </span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                     />
//                   </label>
//                   <p className="mt-2 text-sm text-stone-500">
//                     Supported formats: JPG
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Results Section */}
//       {structuredResult && (
//         <section className="py-16 bg-stone-900 text-white">
//           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-serif mb-8 text-center">
//               Analysis Result
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {structuredResult.map((item, index) => {
//                 const isExpanded = expandedItems.includes(index);
//                 const words = item.value.split(" ");
//                 const isLongText = words.length > 60;
//                 const previewText = words.slice(0, 60).join(" ");

//                 return (
//                   <div
//                     key={index}
//                     className="bg-stone-800 p-6 rounded-lg shadow-lg flex flex-col items-start space-y-4"
//                   >
//                     <div className="flex items-start space-x-4">
//                       <FaInfoCircle className="text-amber-500 text-2xl flex-shrink-0" />
//                       <h3 className="text-lg font-semibold">{item.key}</h3>
//                     </div>
//                     <p className="text-stone-300">
//                       {isExpanded || !isLongText ? item.value : `${previewText}...`}
//                     </p>
//                     {isLongText && (
//                       <button
//                         onClick={() => toggleExpand(index)}
//                         className="text-amber-500 text-sm font-semibold focus:outline-none"
//                       >
//                         {isExpanded ? "Read Less" : "Read More"}
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>
//       )}

//       {error && (
//         <div className="bg-red-500 text-white text-center py-4 mt-4">
//           {error}
//         </div>
//       )}
//     </>
//   );
// };

// export default DiscoverArtifact;









// best tha abtak ka

// import React, { useState, ChangeEvent } from "react";
// import { FaInfoCircle } from "react-icons/fa";

// const DiscoverArtifact: React.FC = () => {
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Handle image upload
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   // Handle Analyze button click
//   const handleAnalyze = async () => {
//     if (!image) {
//       alert("Please upload an image first.");
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setResult(data.result); // Assuming the backend sends the result in `data.result`
//       } else {
//         setError("Error processing the image.");
//       }
//     } catch (error) {
//       setError("An error occurred while analyzing the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Parse the result into a structured format
//   const parseResult = (result: string | null) => {
//     if (!result) return null;

//     // Remove all '*' characters globally
//     const sanitizedResult = result.replace(/\*/g, "");

//     // Split the sanitized result into meaningful sections
//     const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

//     return lines.map((line) => {
//       const [key, ...valueParts] = line.split(":");
//       return { key: key.trim(), value: valueParts.join(":").trim() };
//     });
//   };

//   const structuredResult = parseResult(result);

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6">Discover Artifacts</h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Upload images of artifacts to unlock their history using our advanced AI recognition technology.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Upload Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl mx-auto">
//             <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-12 text-center">
//               {image ? (
//                 <div className="space-y-4">
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt="Preview"
//                     className="max-h-64 mx-auto"
//                   />
//                   <button
//                     onClick={handleAnalyze}
//                     disabled={loading}
//                     className={`bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors ${
//                       loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {loading ? "Analyzing..." : "Analyze Artifact"}
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block">
//                     <span className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors cursor-pointer">
//                       Upload Artifact Image
//                     </span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                     />
//                   </label>
//                   <p className="mt-2 text-sm text-stone-500">
//                     Supported formats: JPG
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Results Section */}
//       {structuredResult && (
//         <section className="py-16 bg-stone-900 text-white">
//           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-serif mb-8 text-center">
//               Analysis Result
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {structuredResult.map((item, index) => (
//                 <div
//                   key={index}
//                   className="bg-stone-800 p-6 rounded-lg shadow-lg flex items-start space-x-4"
//                 >
//                   <FaInfoCircle className="text-amber-500 text-2xl flex-shrink-0" />
//                   <div>
//                     <h3 className="text-lg font-semibold">{item.key}</h3>
//                     <p className="text-stone-300">{item.value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {error && (
//         <div className="bg-red-500 text-white text-center py-4 mt-4">
//           {error}
//         </div>
//       )}
//     </>
//   );
// };

// export default DiscoverArtifact;














// // working but not good UI lekin output masttt

// import React, { useState, ChangeEvent } from "react";

// const DiscoverArtifact: React.FC = () => {
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Handle image upload
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   // Handle Analyze button click
//   const handleAnalyze = async () => {
//     if (!image) {
//       alert("Please upload an image first.");
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setResult(data.result); // Assuming the backend sends the result in `data.result`
//       } else {
//         setError("Error processing the image.");
//       }
//     } catch (error) {
//       setError("An error occurred while analyzing the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Parse the result into a structured format
//   // const parseResult = (result: string | null) => {
//   //   if (!result) return null;

//   //   // Split the result by lines and map to key-value pairs
//   //   const lines = result.split("\n").filter((line) => line.trim() !== "");
//   //   return lines.map((line, index) => {
//   //     const [key, ...valueParts] = line.split(":");
//   //     return { key: key.trim(), value: valueParts.join(":").trim() };
//   //   });
//   // };

//   // Parse the result into a structured format
//   const parseResult = (result: string | null) => {
//     if (!result) return null;

//     // Remove all '*' characters globally
//     const sanitizedResult = result.replace(/\*/g, "");

//     // Split the sanitized result into meaningful sections
//     const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

//     return lines.map((line) => {
//       const [key, ...valueParts] = line.split(":");
//       return { key: key.trim(), value: valueParts.join(":").trim() };
//     });
//   };


//   const structuredResult = parseResult(result);

//   return (
//     <div className="container mx-auto pt-20 px-4">
//       <h1 className="text-2xl font-bold mb-6">Artifact Recognition</h1>

//       <div className="mb-6">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
//         />
//       </div>

//       <button
//         onClick={handleAnalyze}
//         disabled={loading}
//         className={`bg-blue-600 text-white px-6 py-2 rounded ${
//           loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
//         }`}
//       >
//         {loading ? "Analyzing..." : "Analyze"}
//       </button>

//       {error && <div className="mt-4 text-red-500">{error}</div>}

//       {structuredResult && (
//         <div className="mt-8 bg-gray-100 p-6 rounded shadow">
//           <h2 className="text-xl font-semibold mb-4">Analysis Result:</h2>
//           <ul className="space-y-2">
//             {structuredResult.map((item, index) => (
//               <li key={index}>
//                 <span className="font-bold">{item.key}:</span> {item.value}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiscoverArtifact;











// working properly in unstructured format

// import React, { useState, ChangeEvent } from "react";

// const DiscoverArtifact: React.FC = () => {
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Handle image upload
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   // Handle Analyze button click
//   const handleAnalyze = async () => {
//     if (!image) {
//       alert("Please upload an image first.");
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       // Make a request to your backend to process the image
//       const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setResult(data.result); // Assuming the backend sends the result in `data.result`
//       } else {
//         setError("Error processing the image.");
//       }
//     } catch (error) {
//       setError("An error occurred while analyzing the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container pt-20">
//       <h1>Artifact Recognition</h1>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//       />
//       <button onClick={handleAnalyze} disabled={loading}>
//         {loading ? "Analyzing..." : "Analyze"}
//       </button>

//       {error && <div className="error">{error}</div>}

//       {result && (
//         <div className="result">
//           <h2>Analysis Result:</h2>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiscoverArtifact;















// import React, { useState } from 'react';
// import { Search, Upload, Database, History } from 'lucide-react';

// function DiscoverArtifacts() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string>('');

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const features = [
//     {
//       icon: <Search className="text-amber-700" size={24} />,
//       title: 'Instant Recognition',
//       description: 'Upload any artifact image for immediate AI-powered identification and analysis'
//     },
//     {
//       icon: <Database className="text-amber-700" size={24} />,
//       title: 'Comprehensive Database',
//       description: 'Access our extensive database of historical artifacts and their detailed information'
//     },
//     {
//       icon: <History className="text-amber-700" size={24} />,
//       title: 'Historical Context',
//       description: 'Get detailed insights about the time period, culture, and significance of artifacts'
//     }
//   ];

//   const recentDiscoveries = [
//     {
//       image: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?ixlib=rb-4.0.3',
//       title: 'Ancient Greek Amphora',
//       period: '5th Century BCE',
//       location: 'Mediterranean'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1608376630927-31d5c5e636c1?ixlib=rb-4.0.3',
//       title: 'Roman Mosaic',
//       period: '2nd Century CE',
//       location: 'Italy'
//     },
//     {
//       image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3',
//       title: 'Medieval Manuscript',
//       period: '12th Century CE',
//       location: 'France'
//     }
//   ];

//   return (
//     <div className="pt-16">
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6">Discover Artifacts</h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Upload images of artifacts to unlock their history using our advanced AI recognition technology
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Upload Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl mx-auto">
//             <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-12 text-center">
//               {previewUrl ? (
//                 <div className="space-y-4">
//                   <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto" />
//                   <button 
//                     className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
//                     onClick={() => {/* Add analysis logic */}}
//                   >
//                     Analyze Artifact
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <Upload className="mx-auto text-stone-400 mb-4" size={48} />
//                   <label className="block">
//                     <span className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors cursor-pointer">
//                       Upload Artifact Image
//                     </span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                     />
//                   </label>
//                   <p className="mt-2 text-sm text-stone-500">
//                     Supported formats: JPG, PNG, WEBP
//                   </p>
//                 </div>
//               )}
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

//       {/* Recent Discoveries */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-serif text-center text-stone-800 mb-12">
//             Recent Discoveries
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {recentDiscoveries.map((discovery, index) => (
//               <div key={index} className="bg-stone-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
//                 <img
//                   src={discovery.image}
//                   alt={discovery.title}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-serif text-stone-800 mb-2">{discovery.title}</h3>
//                   <p className="text-stone-600">{discovery.period}</p>
//                   <p className="text-stone-500">{discovery.location}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default DiscoverArtifacts;