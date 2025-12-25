import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6 space-y-4">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 drop-shadow-sm text-center">
        Project is Completely Setup!
      </h1>

      {/* Subheading */}
      <p className="text-lg text-gray-600 text-center">
        You can start your project directly.
      </p>

      {/* Note Box */}
      <div className="p-4 bg-white rounded-lg shadow-md text-gray-700 text-center">
        Clean this App.js and continue building your app.
      </div>
    </div>
  );
};

export default App;
