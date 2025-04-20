import React from 'react';
import Image from 'next/image';

type ErrorScreenProps = {
  error: string;
};

export default function ErrorScreen({ error }: ErrorScreenProps): JSX.Element {
  return (
    <section className="w-screen h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center flex flex-col items-center space-y-6">
        {/* Error image (illustration) */}
        <Image
          src="/images/error.jpg" // Make sure this image exists in public/images
          alt="Error"
          width={200}
          height={200}
        />

        {/* Error heading */}
        <h2 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h2>

        {/* Actual error message */}
        <p className="text-gray-700">{error}</p>

        {/* Optional retry button or go back (customize if needed) */}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
