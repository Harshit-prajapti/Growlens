"use client";
import animationData from "@/lottie/loading2.json";
import Lottie from "react-lottie";
import React from "react";

const Loader = () => {
  const defaultOption = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <div><Lottie options={defaultOption} height={300} width={300}/></div>;
};

export default Loader;
