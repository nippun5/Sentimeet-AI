"use client";

import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import Link from "next/link";

function Hero() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-center p-4"
      style={{
        backgroundImage: "url('/image/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-50 p-6 rounded-lg">
        <Typography variant="h1" className="mb-4"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Welcome to Sentimeet
        </Typography>
        <Typography variant="lead" className="mb-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Create meetings, get analytics and track your organization's data.
        </Typography>
        <div className="flex justify-center gap-4">
          <Button size="lg" color="white" className="text-black" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Start new meeting
          </Button>
          <Link href="/analytics">
          <Button
              size="lg"
              className="border border-white text-white hover:bg-white hover:text-black transition-colors" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            See analytics
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
