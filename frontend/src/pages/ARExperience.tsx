import React, { useState } from 'react';
import { Camera, Compass, Cuboid as Cube, Layers } from 'lucide-react';

function ARExperience() {
  const [selectedMode, setSelectedMode] = useState<'view' | 'explore'>('view');

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
      image: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?ixlib=rb-4.0.3',
      title: 'Greek Vase',
      period: 'Classical Period',
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1608376630927-31d5c5e636c1?ixlib=rb-4.0.3',
      title: 'Roman Statue',
      period: 'Imperial Rome',
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3',
      title: 'Medieval Armor',
      period: 'Middle Ages',
      available: true
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">AR Experience</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Step into history with our immersive AR technology
            </p>
            <div className="inline-flex rounded-lg border border-stone-700 p-1 bg-stone-800">
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  selectedMode === 'view'
                    ? 'bg-amber-700 text-white'
                    : 'text-stone-400 hover:text-white'
                }`}
                onClick={() => setSelectedMode('view')}
              >
                View Mode
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  selectedMode === 'explore'
                    ? 'bg-amber-700 text-white'
                    : 'text-stone-400 hover:text-white'
                }`}
                onClick={() => setSelectedMode('explore')}
              >
                Explore Mode
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AR Viewer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-video bg-stone-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Camera className="mx-auto text-stone-400 mb-4" size={48} />
              <p className="text-stone-600">
                {selectedMode === 'view' 
                  ? 'Point your camera at a flat surface to place artifacts'
                  : 'Scan an artifact to create a 3D model'
                }
              </p>
              <button className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors">
                {selectedMode === 'view' ? 'Start AR View' : 'Start Scanning'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
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
          <div className="grid md:grid-cols-3 gap-8">
            {artifacts.map((artifact, index) => (
              <div key={index} className="bg-stone-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={artifact.image}
                    alt={artifact.title}
                    className="w-full h-48 object-cover"
                  />
                  {artifact.available && (
                    <div className="absolute top-4 right-4 bg-amber-700 text-white text-sm px-3 py-1 rounded-full">
                      AR Ready
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-stone-800 mb-2">{artifact.title}</h3>
                  <p className="text-stone-600">{artifact.period}</p>
                  <button className="mt-4 w-full bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors">
                    View in AR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ARExperience;