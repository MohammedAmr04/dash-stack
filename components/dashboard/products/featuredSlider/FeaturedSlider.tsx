"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Carousel } from "antd";
import Slide from "./Slide";

const FeaturedSlider = () => {
  return (
    <Carousel
      arrows
      prevArrow={
        <button className="px-3  py-2.5 w-10 h-10 flex items-center  rounded-full bg-background-dark">
          <CaretLeftIcon size={12} />
        </button>
      }
      nextArrow={
        <button className="px-3  py-2.5 w-10 h-10 flex items-center  rounded-full bg-background-dark">
          <CaretRightIcon size={12} />
        </button>
      }
    >
      <Slide />
      <Slide />
    </Carousel>
  );
};

export default FeaturedSlider;
