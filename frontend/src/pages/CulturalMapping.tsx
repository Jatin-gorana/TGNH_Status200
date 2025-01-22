import React from 'react';
import { Map } from 'lucide-react';

function CulturalMapping() {
  return (
    <div className="pt-16">
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6">Cultural Evolution Timeline</h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Explore the journey of cultural artifacts through time
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-amber-700"></div>
            {[
              {
                year: '3000 BCE',
                event: 'Early Bronze Age Artifacts',
                image: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?ixlib=rb-4.0.3'
              },
              {
                year: '500 BCE',
                event: 'Classical Period Treasures',
                image: 'https://images.unsplash.com/photo-1608376630927-31d5c5e636c1?ixlib=rb-4.0.3'
              },
              {
                year: '800 CE',
                event: 'Medieval Manuscripts',
                image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3'
              },
              {
                year: '1500 CE',
                event: 'Renaissance Art',
                image: 'https://images.unsplash.com/photo-1544333323-ec9ed3218dd1?ixlib=rb-4.0.3'
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}
                >
                  <div className="bg-stone-100 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={item.image}
                      alt={item.event}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-serif text-amber-700 mb-2">{item.year}</h3>
                      <p className="text-stone-600">{item.event}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-700 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CulturalMapping;