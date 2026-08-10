import React from "react";

function IsLoading({ loading }) {
  if (!loading) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Search */}
      <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse mb-8"></div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6grid md:gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="h-52 bg-gray-200 animate-pulse"></div>

            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>

              <div className="flex justify-between mt-4">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IsLoading;
