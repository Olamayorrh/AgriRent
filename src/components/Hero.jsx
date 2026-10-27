import React, { useEffect, useRef, useState } from "react";
import machine1 from "../assets/images/machine_land.png";
import logo1 from "../assets/images/carbon_sprout.png";
import arrow from "../assets/images/arrow.png";
import arrow2 from "../assets/images/arrowW.png";
import logo2 from "../assets/images/carbon_car.png";
import logo3 from "../assets/images/verified.png";
import logo4 from "../assets/images/mark.png";
import logo5 from "../assets/images/sync.png";
import background from "../assets/images/background_img1.png";

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

const base = "transition-all duration-700 ease-out";

const Hero = () => {
  const [heroTextRef, heroTextVisible] = useInView();
  const [heroImgRef, heroImgVisible] = useInView();
  const [cardsRef, cardsVisible] = useInView();
  const [badgesRef, badgesVisible] = useInView();

  return (
    <div
      className="relative w-full h-full pt-[4rem] px-[2rem] lg:pt-[10.8rem] lg:pl-[4.9rem] lg:pr-0 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Hero text + image */}
      <div className="w-full flex flex-col lg:flex-row p-2">
        <div
          ref={heroTextRef}
          className={`w-full lg:w-[50%] flex flex-col text-[2.2rem] lg:text-[3.5rem] text-white ${base} ${
            heroTextVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          <div>
            <h2>
              Rent the Power, <br />{" "}
              <span className="text-[var(--primary-color)]">
                Manage the Growth.
              </span>
            </h2>
          </div>

          <div className="mt-[3rem] lg:mt-[6.8rem] italic text-[1.5rem] lg:text-[2.2rem]">
            <p>
              Access reliable machinery near you and
              <br /> effortlessly track your farm plots, crop cycles
              <br /> and daily tasks on a single unified platform.
            </p>
          </div>
        </div>

        <div
          ref={heroImgRef}
          className={`w-full lg:w-[50%] mt-4 lg:mt-0 ${base} delay-200 ${
            heroImgVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}
        >
          <img src={machine1} alt="machine" className="w-full" />
        </div>
      </div>

      {/* Farmer / Equipment Owner cards */}
      <div
        ref={cardsRef}
        className="relative z-10 flex flex-col lg:flex-row gap-4 lg:gap-[5%] w-full mt-4 lg:mt-0"
      >
        <div
          className={`border rounded-2xl w-full lg:w-[45%] bg-[var(--primary-color)] text-[var(--secondary-color)] p-[2rem] ${base} ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="w-[20%]">
            <img src={logo1} alt="logo image" />
          </div>

          <div className="mt-[3.0rem] text-[1.2rem]">
            <p className="text-[2rem] lg:text-[2.5rem]">I'm a Farmer</p>
            <span className="flex items-center gap-4 mt-[0.5rem]">
              Rent machinery and manage your farm plots
              <a href="">
                <img className="w-[2.0rem]" src={arrow} alt="learn more" />
              </a>
            </span>
          </div>
        </div>

        <div
          className={`border-2 border-white rounded-2xl w-full lg:w-[45%] text-white p-[2rem] ${base} delay-150 ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="w-[20%]">
            <img src={logo2} alt="logo image" />
          </div>

          <div className="mt-[3.0rem] text-[1.2rem]">
            <p className="text-[2rem] lg:text-[2.5rem]">I'm an Equipment Owner</p>
            <p className="flex items-center gap-[20%] mt-[0.5rem]">
              List assets and earn income
              <a href="">
                <img className="w-[2.0rem]" src={arrow2} alt="learn more" />
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div
        ref={badgesRef}
        className={`flex flex-wrap gap-6 lg:gap-[20%] py-6 text-[1.2rem] lg:text-[1.4rem] items-center text-white w-full mt-[4rem] lg:mt-[10rem] ${base} delay-300 ${
          badgesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-6">
          <img className="w-[3rem] h-[3rem]" src={logo3} alt="logo" />
          <p>Verified Equipment Owners</p>
        </div>
        <div className="flex items-center gap-6">
          <img className="w-[2.5rem] h-[2.5rem]" src={logo4} alt="logo" />
          <p>Transparent Pricing</p>
        </div>
        <div className="flex items-center gap-6">
          <img className="w-[3rem] h-[3rem]" src={logo5} alt="logo" />
          <p>Auto-sync Schedules</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
