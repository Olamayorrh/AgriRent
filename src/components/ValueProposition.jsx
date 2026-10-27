import React, { useEffect, useRef, useState } from "react";
import farmlogo1 from "../assets/images/farm1.png";
import farmlogo2 from "../assets/images/farm2.png";
import farmlogo3 from "../assets/images/farm3.png";
import equiplogo1 from "../assets/images/equip1.png";
import equiplogo2 from "../assets/images/equip2.png";
import equiplogo3 from "../assets/images/equip3.png";

/* ─── Custom hook: fires once when element enters the viewport ─── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

/* ─── Shared transition base ─── */
const base = "transition-all duration-700 ease-out";

/* Direction helpers — start hidden, animate to visible */
const from = {
  top:    (v) => `${base} ${v ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`,
  bottom: (v) => `${base} ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
  left:   (v) => `${base} ${v ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`,
  right:  (v) => `${base} ${v ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`,
};

const ValueProposition = () => {
  const farmer = [
    {
      id: 1,
      title: "Map Your Farm",
      body: "Add your farm plots, define \n boundaries, and log your\n crop schedule.",
      image: farmlogo1,
    },
    {
      id: 2,
      title: "Book Machinery",
      body: "Browse local verified\n equipment with upfront\n daily or hourly rates.",
      image: farmlogo2,
    },
    {
      id: 3,
      title: "Track & Grow",
      body: "Coordinate field delivery, log\n operations, and monitor crop\n stages.",
      image: farmlogo3,
    },
  ];

  const equipOwners = [
    {
      id: 1,
      title: "List Assets",
      body: "Upload machinery details,\n daily rental rates, and\n service coverage.",
      image: equiplogo1,
    },
    {
      id: 2,
      title: "Accepts Bookings",
      body: "Receive rental requests\n from verified local farmers\n and confirm dates.",
      image: equiplogo2,
    },
    {
      id: 3,
      title: "Earn Securely",
      body: "Hand off equipment safely\n and receive direct,\n guaranteed payouts.",
      image: equiplogo3,
    },
  ];

  /* ── Refs for each animated section ── */
  const [headingRef, headingVisible]         = useInView();
  const [farmerTitleRef, farmerTitleVisible] = useInView();
  const [equipTitleRef, equipTitleVisible]   = useInView();

  /* Per-item refs for farmer items (bottom stagger) */
  const farmerRefs = farmer.map(() => useInView(0.1));
  /* Per-item refs for equipment items (bottom stagger) */
  const equipRefs  = equipOwners.map(() => useInView(0.1));

  return (
    <div className="w-full">

      {/* ── Heading — slides in from top ── */}
      <div
        ref={headingRef}
        className={`w-full text-center p-[2rem] lg:p-[5.0rem] text-[1.8rem] lg:text-[2.5rem] text-[var(--secondary-color)] ${from.top(headingVisible)}`}
      >
        <h2>How It Works: Streamlined For All</h2>
      </div>

      <div className="w-full flex flex-col lg:flex-row bg-[#8A928D80]">

        {/* ══ For Farmers — slides in from LEFT ══ */}
        <div className="w-full lg:w-[50%] lg:border-r flex flex-col items-center lg:items-start">

          {/* Section pill — from left */}
          <div
            ref={farmerTitleRef}
            className={`text-center text-[1.8rem] lg:text-[2.5rem] flex justify-center w-full my-[1.5rem] ${from.left(farmerTitleVisible)}`}
          >
            <h2 className="flex justify-center rounded-2xl bg-[#DDA15E] text-[var(--secondary-color)] p-2 w-[80%]">
              For Farmers
            </h2>
          </div>

          {/* Items — slide from bottom with stagger via delay */}
          <div className="p-2 flex flex-col items-center lg:items-start w-full">
            {farmer.map((value, i) => {
              const [ref, visible] = farmerRefs[i];
              const delays = ["delay-0", "delay-150", "delay-300"];
              return (
                <div
                  key={value.id}
                  ref={ref}
                  className={`flex mb-[2rem] gap-[8%] lg:gap-[12%] w-full max-w-[50rem] lg:max-w-none
                    ${from.bottom(visible)} ${delays[i]}`}
                >
                  <div className="w-[8rem] h-[8rem] lg:w-[12rem] lg:h-[12rem] flex-shrink-0">
                    <img src={value.image} alt="logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-[1.8rem] lg:text-[2.5rem] text-[var(--secondary-color)]">
                      {value.id}. <span>{value.title}</span>
                    </h1>
                    <p
                      className="text-[1.4rem] lg:text-[1.5rem] mt-[1.0rem]"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {value.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ For Equipment Owners — slides in from RIGHT ══ */}
        <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start border-t lg:border-t-0">

          {/* Section pill — from right */}
          <div
            ref={equipTitleRef}
            className={`text-center text-[1.8rem] lg:text-[2.5rem] flex justify-center w-full my-[1.5rem] ${from.right(equipTitleVisible)}`}
          >
            <h2 className="flex justify-center rounded-2xl p-2 w-[80%] text-white border bg-[var(--secondary-color)]">
              For Equipment Owners
            </h2>
          </div>

          {/* Items — slide from bottom with stagger */}
          <div className="p-2 flex flex-col items-center lg:items-start w-full">
            {equipOwners.map((value, i) => {
              const [ref, visible] = equipRefs[i];
              const delays = ["delay-0", "delay-150", "delay-300"];
              return (
                <div
                  key={value.id}
                  ref={ref}
                  className={`flex mb-[2rem] gap-[8%] lg:gap-[15%] w-full max-w-[50rem] lg:max-w-none
                    ${from.bottom(visible)} ${delays[i]}`}
                >
                  <div className="w-[8rem] h-[8rem] lg:w-[12rem] lg:h-[12rem] flex-shrink-0 p-2">
                    <img src={value.image} alt="logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-start">
                    <h1 className="text-[1.8rem] lg:text-[2.5rem] text-[var(--secondary-color)]">
                      {value.id}. <span>{value.title}</span>
                    </h1>
                    <p
                      className="text-[1.4rem] lg:text-[1.5rem] mt-[1.0rem] justify-center"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {value.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ValueProposition;
