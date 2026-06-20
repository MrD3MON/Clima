import { Meteors } from "~/components/magicui/meteors";
import { type WeatherData } from "~/lib/weather-api";
import { motion } from "motion/react";

interface WeatherBackgroundProps {
  weatherData: WeatherData;
  children: React.ReactNode;
}

export function WeatherBackground({
  weatherData,
  children,
}: WeatherBackgroundProps) {
  const conditionCode = weatherData.current.condition.code;
  const isDay = weatherData.current.is_day === 1;

  // Determine weather overlays and animation settings
  const getWeatherOverlayAndAnimations = () => {
    if (!isDay) {
      return {
        overlayClass: "bg-black/30",
        showMeteors: true,
        meteorColor: "white",
      };
    }

    // Day time conditions
    if (conditionCode === 800) {
      // Clear sky
      return {
        overlayClass: "bg-transparent",
        showMeteors: false,
        meteorColor: "white",
      };
    }

    if (conditionCode >= 200 && conditionCode < 300) {
      // Thunderstorm
      return {
        overlayClass: "bg-slate-950/30 backdrop-blur-[1px] saturate-50",
        showMeteors: true,
        meteorColor: "blue",
      };
    }

    if (conditionCode >= 300 && conditionCode < 600) {
      // Rain
      return {
        overlayClass: "bg-slate-950/20 saturate-75",
        showMeteors: true,
        meteorColor: "blue",
      };
    }

    if (conditionCode >= 600 && conditionCode < 700) {
      // Snow
      return {
        overlayClass: "bg-white/10 dark:bg-white/5",
        showMeteors: true,
        meteorColor: "white",
      };
    }

    // Default for cloudy/misty conditions
    return {
      overlayClass: "bg-black/5 dark:bg-black/15",
      showMeteors: false,
      meteorColor: "white",
    };
  };

  const { overlayClass, showMeteors, meteorColor } = getWeatherOverlayAndAnimations();

  return (
    <div className="relative min-h-screen theme-gradient overflow-x-hidden transition-all duration-1000">
      {/* Dynamic weather overlay */}
      <div className={`absolute inset-0 ${overlayClass} pointer-events-none transition-all duration-1000`} />
      {/* Animated weather elements */}
      {showMeteors && <Meteors number={isDay ? 20 : 40} />}

      {/* Sun or moon */}
      {isDay && conditionCode === 800 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute right-10 top-10 h-20 w-20 rounded-full bg-yellow-300 shadow-[0_0_40px_20px_rgba(253,224,71,0.7)]"
        />
      )}

      {!isDay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute right-10 top-10 h-16 w-16 rounded-full bg-slate-200 shadow-[0_0_30px_10px_rgba(226,232,240,0.3)]"
        />
      )}

      {/* Clouds for cloudy weather */}
      {conditionCode > 800 && isDay && (
        <>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.7 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute left-10 top-20 h-16 w-32 rounded-full bg-white/80 blur-md"
          />
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.9 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2,
            }}
            className="absolute right-20 top-40 h-20 w-40 rounded-full bg-white/80 blur-md"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
