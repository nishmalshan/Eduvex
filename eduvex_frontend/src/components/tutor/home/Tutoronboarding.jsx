// components/tutor/TutorOnboarding.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { completeOnboarding } from "../../../redux/features/courseSlice";

const slides = [
  {
    id: 1,
    icon: "🎉",
    badge: "Welcome",
    title: "You're now a Tutor!",
    description:
      "Congratulations! Your application has been approved. You're officially part of our instructor community. Get ready to share your knowledge with thousands of eager learners.",
    highlight: "Your journey starts here.",
    color: "from-violet-600 to-indigo-600",
    lightColor: "bg-violet-50",
    accentColor: "text-violet-600",
    badgeBg: "bg-violet-100 text-violet-700",
  },
  {
    id: 2,
    icon: "🛠️",
    badge: "Step 1",
    title: "Create Your First Course",
    description:
      "Use our intuitive course builder to structure your content into sections and lectures. Upload videos, add resources, and set your own price — complete creative control is yours.",
    highlight: "Upload. Structure. Publish.",
    color: "from-emerald-600 to-teal-600",
    lightColor: "bg-emerald-50",
    accentColor: "text-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 3,
    icon: "📈",
    badge: "Step 2",
    title: "Track & Grow",
    description:
      "Your tutor dashboard gives you real-time insights: enrollments, ratings, revenue, and student progress — all in one place. Know exactly how your courses are performing.",
    highlight: "Data that drives decisions.",
    color: "from-orange-500 to-amber-500",
    lightColor: "bg-amber-50",
    accentColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  {
    id: 4,
    icon: "🌍",
    badge: "You're Ready",
    title: "Reach Global Learners",
    description:
      "Your courses will be discoverable by learners worldwide. Our platform handles payments, certificates, and support — you focus on teaching what you love.",
    highlight: "Build. Inspire. Earn.",
    color: "from-rose-500 to-pink-600",
    lightColor: "bg-rose-50",
    accentColor: "text-rose-600",
    badgeBg: "bg-rose-100 text-rose-700",
  },
];

export default function TutorOnboarding() {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const goTo = (index) => {
    if (index === current || exiting) return;
    setExiting(true);
    setTimeout(() => {
      setCurrent(index);
      setExiting(false);
    }, 250);
  };

  const handleNext = () => {
    if (isLast) {
      dispatch(completeOnboarding());
    } else {
      goTo(current + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div
          className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            exiting ? "opacity-0 translate-y-2 scale-[0.99]" : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          {/* Top gradient bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${slide.color}`} />

          {/* Decorative blob */}
          <div
            className={`absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br ${slide.color} opacity-10 blur-2xl pointer-events-none`}
          />

          <div className="p-8 sm:p-12">
            {/* Badge */}
            <span
              className={`inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6 ${slide.badgeBg}`}
            >
              {slide.badge}
            </span>

            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl ${slide.lightColor} flex items-center justify-center text-3xl mb-6 shadow-sm`}>
              {slide.icon}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-lg leading-relaxed mb-4">
              {slide.description}
            </p>

            {/* Highlight */}
            <p className={`text-base font-semibold ${slide.accentColor} mb-10`}>
              {slide.highlight}
            </p>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mb-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? `w-8 h-2.5 bg-gradient-to-r ${slide.color}`
                      : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => dispatch(completeOnboarding())}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
              >
                Skip for now
              </button>

              <div className="flex gap-3">
                {current > 0 && (
                  <button
                    onClick={() => goTo(current - 1)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`px-7 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${slide.color} hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95`}
                >
                  {isLast ? "Get Started →" : "Next →"}
                </button>
              </div>
            </div>
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-300 select-none">
            {current + 1} / {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
}