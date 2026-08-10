import React from "react";
import { Link } from "react-router-dom";

export default function OccasionsAndCollections() {
  const occasions = [
    {
      title: "Weddings",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      link: "/shop",
    },
    {
      title: "Birthdays",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
      link: "/shop",
    },
  ];

  const collections = [
    {
      title: "Eco-friendly",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      link: "/shop",
    },
    {
      title: "Local Artisans",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      link: "/shop",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* Our Occasion Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Our Occasion
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {occasions.map((occ, idx) => (
            <Link
              key={idx}
              to={occ.link}
              className="group relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex items-end p-5"
            >
              <img
                src={occ.image}
                alt={occ.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="text-xl sm:text-2xl font-black">{occ.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Our Collection Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Our Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              to={col.link}
              className="group relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex items-end p-5"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="text-xl sm:text-2xl font-black">{col.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

