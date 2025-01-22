import React from 'react';
import { Users, Upload, Globe } from 'lucide-react';

function Community() {
  return (
    <div className="pt-16">
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">Join Our Community</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Connect with experts and enthusiasts in cultural preservation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload size={24} />,
                title: 'Share Discoveries',
                description: 'Upload your artifact findings and contribute to our global database'
              },
              {
                icon: <Users size={24} />,
                title: 'Connect with Experts',
                description: 'Engage with archaeologists and historians worldwide'
              },
              {
                icon: <Globe size={24} />,
                title: 'Global Impact',
                description: 'Be part of preserving cultural heritage for future generations'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-stone-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-amber-700 mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Community;