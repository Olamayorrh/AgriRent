import React, { useEffect, useRef, useState } from "react";

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

const Footer = () => {
  const [contentRef, contentVisible] = useInView();

  return (
    /* mobile/tablet: pt-[4rem] — no CTA overlap, so normal spacing */
    /* lg+: pt-[20rem] — accommodates the CTA card overlapping from AboutUs */
    <div className="bg-[var(--secondary-color)] text-white pt-[4rem] lg:pt-[20rem] overflow-hidden">

      {/* Main footer columns */}
      <div
        ref={contentRef}
        className={`flex flex-col lg:flex-row justify-evenly gap-[3rem] lg:gap-0 px-[3rem] lg:px-0 pb-8 ${base} ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div>
          <h2 className="text-[var(--primary-color)] text-[2.0rem] mb-[1rem] font-semibold">
            AgriRent &amp; Farm Hub
          </h2>
          <p className="text-[1.5rem] leading-loose">
            A web platform that connects local
            <br /> farmers who need tractors and <br />
            machinery with equipment owners
            <br /> who want to rent theirs out. It
            <br />
            makes farming easier and more
            <br /> affordable by sharing machinery
            <br />
            instead of buying expensive
            <br /> equipment.
          </p>
        </div>

        <div>
          <h2 className="text-[var(--primary-color)] text-[1.8rem] mb-[1rem] font-semibold">
            Quick Links
          </h2>
          <div className="flex flex-col gap-4 text-[1.4rem]">
            <a href="#" className="hover:underline hover:decoration-4 hover:decoration-[var(--primary-color)] hover:underline-offset-4">
              Home
            </a>
            <a href="#" className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4">
              About Us
            </a>
            <a href="#" className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4">
              How it Works
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-[var(--primary-color)] text-[1.8rem] mb-[1rem] font-semibold">
            For User
          </h2>
          <div className="flex flex-col gap-4 text-[1.4rem]">
            <a href="#" className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4">
              Farmer
            </a>
            <a href="#" className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4">
              Equipment Owner
            </a>
            <a href="#" className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4">
              Register
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-[var(--primary-color)] text-[1.8rem] mb-[1rem] font-semibold">
            Contact Us
          </h2>
          <div className="flex flex-col gap-4 text-[1.4rem]">
            <a
              href="mailto:support@agrirentfarmhub.com"
              className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4"
            >
              support@agrirentfarmhub.com
            </a>
            <a
              href="tel:+254790000111"
              className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4"
            >
              +254790 000 111
            </a>
            <a
              href="https://maps.google.com/?q=764+Agrirent+park+Nairobi+Kenya"
              target="_blank"
              rel="noreferrer"
              className="hover:underline hover:decoration-2 hover:decoration-[var(--primary-color)] hover:underline-offset-4"
            >
              764, Agrirent park, Nairobi, Kenya
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white mx-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-[10%] py-8 text-[1.4rem]">
          <p>&copy; 2026 Agrirent &amp; FarmHub</p>
          <p>All rights reserved</p>
          <ul className="flex list-disc gap-10 pl-5">
            <li>Privacy Policy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
