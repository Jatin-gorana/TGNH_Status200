import React from 'react';
import { History, Upload } from 'lucide-react';

function Restoration() {
  return (
    <div className="pt-16">
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">AI-Powered Restoration</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Digitally restore and preserve cultural artifacts
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3"
                alt="Restoration Process"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-stone-800 mb-4">Digital Restoration</h3>
              <p className="text-stone-600 mb-6">
                Use advanced AI algorithms to digitally restore damaged artifacts and preview potential restoration outcomes.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <History className="text-amber-700 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-stone-800">Damage Assessment</h4>
                    <p className="text-stone-600">AI analysis of artifact condition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Upload className="text-amber-700 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-stone-800">Restoration Preview</h4>
                    <p className="text-stone-600">Virtual restoration visualization</p>
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

export default Restoration;