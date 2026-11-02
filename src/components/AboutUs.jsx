import React, { useEffect, useRef, useState } from "react";
import veri from "../assets/images/vericom.png";
import access from "../assets/images/access.png";
import shake from "../assets/images/handshake.png";

const useInView = (threshold = 0.15) => {
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

const AboutUs = () => {
  const [headerRef, headerVisible] = useInView();
  const [missionRef, missionVisible] = useInView();
  const [pillar1Ref, pillar1Visible] = useInView();
  const [pillar2Ref, pillar2Visible] = useInView();
  const [pillar3Ref, pillar3Visible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  return (
    <div className="relative z-10 flex flex-col items-center">
      <h1
        ref={headerRef}
        className={`text-center p-[2rem] lg:p-[3rem] text-[2rem] lg:text-[3rem] font-bold ${base} ${
          headerVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-8"
        }`}
      >
        About Us
      </h1>

      <div className="relative border border-gray-200 shadow-md w-[95%] lg:w-[92%] rounded-2xl bg-white lg:-mb-[9rem]">
        <div
          ref={missionRef}
          className={`flex flex-col items-center  text-[var(--secondary-color)] z-2 ${base} ${
            missionVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-[var(--primary-color)] p-[2rem] text-[2rem] lg:text-[3rem] font-bold">
            Our Mission
          </h1>
          <h2 className="text-[1.5rem] lg:text-[2.2rem] text-center px-[2rem]">
            Bridging the Gap in Local Agriculture
          </h2>
          <p className="text-center text-[1.4rem] lg:text-[1.9rem] p-[2rem]">
            AgriRent FarmHub was created to empower local agricultural
            communities by making smart
            <br /> mechanization accessible to every farmer and profitable for
            every equipment owner. We believe that by <br />
            sharing resources, we build stronger farms and sustainable food
            systems together.
          </p>
        </div>

        <div className="px-[1.5rem] lg:px-[3rem] pb-[2rem]">
          <h1 className="text-center text-[var(--primary-color)] p-[2rem] text-[2rem] lg:text-[3rem] font-bold">
            Core Pillars
          </h1>

          <div className="flex flex-col lg:flex-row justify-between">
            <div
              ref={pillar1Ref}
              className={`flex w-full lg:w-[45%] gap-3 items-start text-[var(--secondary-color)] mb-[3rem] ${base} ${
                pillar1Visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              <div className="flex-shrink-0 w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem]">
                <img
                  src={veri}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-[1.6rem] lg:text-[2rem] mb-[1rem] font-bold">
                  1. Verified Community
                </h1>
                <p className="text-[1.3rem] lg:text-[1.5rem]">
                  Every farmer profile and machine listing undergo rigorous
                  verification to ensure safe, reliable rentals.
                </p>
              </div>
            </div>

            <div
              ref={pillar2Ref}
              className={`flex w-full lg:w-[45%] gap-3 items-start text-[var(--secondary-color)] mb-[3rem] ${base} ${
                pillar2Visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              <div className="flex-shrink-0 w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem]">
                <img
                  src={access}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-[1.6rem] lg:text-[2rem] mb-[1rem] font-bold">
                  2. Affordable Access
                </h1>
                <p className="text-[1.3rem] lg:text-[1.5rem]">
                  Eliminating the high capital costs of machinery ownership so
                  smallholder farmers can boost their yields.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-[1rem]">
            <div
              ref={pillar3Ref}
              className={`flex w-full lg:w-[50%] gap-3 items-start text-[var(--secondary-color)] mb-[3rem] ${base} ${
                pillar3Visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex-shrink-0 w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem]">
                <img
                  src={shake}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-[1.6rem] lg:text-[2rem] mb-[1rem] font-bold">
                  3. Transparent Transactions
                </h1>
                <p className="text-[1.3rem] lg:text-[1.5rem]">
                  Upfront pricing, simple scheduling, and guaranteed secure
                  payouts for equipment owners.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-6 lg:pb-0">
          <div
            ref={ctaRef}
            className={`mb-4 lg:-mb-[9rem] flex flex-col text-center text-[1.6rem] lg:text-[2rem] w-[90%] lg:w-[55%] bg-[var(--primary-color)] p-[2rem] lg:p-[3rem] rounded-2xl text-white shadow-lg ${base} ${
              ctaVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
            }`}
          >
            <p>
              Ready to Transform Your <br /> Farming Operations with
              <br />
              <span className="text-[var(--secondary-color)] font-bold">
                AgriRent?
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-[2rem]">
              <button className="py-3 px-6 border-2 border-[var(--secondary-color)] rounded-2xl text-black transition-all duration-300 hover:text-white hover:bg-[var(--secondary-color)] hover:shadow-lg">
                Rent Machinery
              </button>
              <button className="py-3 px-6 bg-[var(--secondary-color)] rounded-2xl text-white transition-all duration-300 hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] hover:border-2 hover:border-[var(--secondary-color)] hover:shadow-lg">
                List Your Equipment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
