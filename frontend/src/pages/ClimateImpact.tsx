import React from 'react';
import { Cloud, Shield } from 'lucide-react';

function ClimateImpact() {
  return (
    <div className="pt-16">
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">Climate Impact Analysis</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Understand and mitigate climate effects on cultural artifacts
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3"
                alt="Climate Analysis"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-stone-800 mb-4">Preservation Insights</h3>
              <p className="text-stone-600 mb-6">
                Understand how climate change affects cultural artifacts and get AI-powered recommendations for preservation strategies.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Cloud className="text-amber-700 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-stone-800">Environmental Monitoring</h4>
                    <p className="text-stone-600">Real-time climate impact assessment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="text-amber-700 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-stone-800">Preservation Strategies</h4>
                    <p className="text-stone-600">AI-recommended protection measures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClimateImpact;