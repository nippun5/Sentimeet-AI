"use client";

import React from "react";
import { Button } from "@material-tailwind/react";
import Link from "next/link";



function LoginPage() {

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4"
      style={{
        backgroundImage: "url('/image/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Login</h1>
        <p className="text-gray-300 mb-6">Welcome to Sentimeet, enter your credentials to continue.</p>
        
        <div className='mb-5 text-left'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-200 mb-2'>
            Email Address
          </label>
          <input
            type='email'
            placeholder='example@gmail.com'
            className='w-full rounded-lg border border-gray-500 bg-gray-800 py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500' 
          />
        </div>

        <div className='mb-5 text-left'>
          <label htmlFor='password' className='block text-sm font-medium text-gray-200 mb-2'>
            Password
          </label>
          <input
            type='password'
            placeholder='••••••••'
            className='w-full rounded-lg border border-gray-500 bg-gray-800 py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500' 
          />
        </div>

        <Button size="lg" color="white" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Login
        </Button>
        <p className="text-gray-300 mb-8 mt-5">
          Are you a new member ? 
          <Link href="/register" className="text-xl text-purple-400 cursor-pointer hover:underline font-bold"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;