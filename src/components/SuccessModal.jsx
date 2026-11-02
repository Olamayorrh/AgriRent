import React from "react";

const SuccessModal = ({ isOpen, onContinue, onShare }) => {
  if (!isOpen) return null;

  const handleShareClick = () => {
    if (onShare) {
      onShare();
      return;
    }
    if (navigator.share) {
      navigator
        .share({
          title: "AgriRent & FarmHub",
          text: "Join AgriRent & FarmHub to rent machinery and boost your yield!",
          url: window.location.origin,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-[440px] w-full text-center flex flex-col items-center my-auto animate-scale-up">
        
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#E58A3C] flex items-center justify-center mb-3 sm:mb-4">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#E58A3C]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

       
        <h2 className="text-[#D97706] text-lg sm:text-xl font-bold mb-2 sm:mb-3">
          Account Created Successfully
        </h2>

        
        <p className="text-[#1E3A2B] text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-[360px]">
          Welcome to AgriRent &amp; FarmHub! Your account is active and ready to
          go. You can now explore equipment, manage listings, and connect with
          local agricultural partners.
        </p>

        
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:flex-1 bg-[#163323] hover:bg-[#122b1d] text-white font-medium py-2.5 sm:py-3 px-5 rounded-xl text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-sm"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={handleShareClick}
            className="w-full sm:flex-1 border border-gray-400 text-[#163323] hover:bg-gray-50 font-medium py-2.5 sm:py-3 px-5 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <span>Share</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#163323]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
