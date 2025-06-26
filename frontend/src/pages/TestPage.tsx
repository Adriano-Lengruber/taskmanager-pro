import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
          🔧 Test Page
        </h1>
        <p className="text-center text-gray-600">
          Se você consegue ver esta página, o React está funcionando.
        </p>
        <div className="mt-4">
          <button 
            onClick={() => console.log('Button clicked!')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
