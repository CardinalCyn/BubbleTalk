import React from "react";

const Hero=()=>{
  return (
    <div className="bg-white text-blue-500 mt-10 text-center flex flex-col">
        <div className="bg-white py-20 px-10 w-full heroDiv flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold mb-4">Real-time messaging</h1>
            <p className="text-lg">Chat with your friends and colleagues in real-time, from anywhere in the world.</p>
        </div>
        <div className="bg-blue-500 text-white py-20 px-10 w-full heroDiv flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold mb-4">Create and join rooms</h2>
            <p className="text-lg">Easily create and join chat rooms with your colleagues or friends to stay connected and productive.</p>
        </div>
        <div className="bg-white py-20 px-10 w-full heroDiv flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold mb-4">Customize your profile</h1>
            <p className="text-lg">Personalize your chat experience with custom profile pictures and status messages.</p>
        </div>
        <div className="bg-blue-500 text-white py-20 px-10 w-full heroDiv flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold mb-4">Message history at your fingertips</h2>
            <p className="text-lg">Access all of your past messages, so you never miss a beat.</p>
        </div>
    </div>
  );
};

export default Hero;