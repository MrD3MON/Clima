"use client";

import { useEffect, useState } from "react";
import { CurrentWeather } from "~/components/weather/current-weather";
import { Forecast } from "~/components/weather/forecast";
import { LocationSearch } from "~/components/weather/location-search";
import { WeatherBackground } from "~/components/weather/weather-background";
import { ThemeSwitcher } from "~/components/weather/theme-switcher";
import { ClimaLogo } from "~/components/weather/clima-logo";
import { motion } from "motion/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import {
  type WeatherData,
  getWeatherByCoordinates,
  getWeatherByPostalCode,
  getWeatherByCity,
} from "~/lib/weather-api";

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [theme, setTheme] = useState<"sage" | "sunset" | "sand">("sand");
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Load persisted theme/mode
    const savedTheme = localStorage.getItem("clima-theme") as "sand" | "sunset" | "sage" | null;
    const savedMode = localStorage.getItem("clima-mode") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Remove previous theme classes
    root.classList.remove("theme-sage", "theme-sunset", "theme-sand", "light", "dark");
    // Add new classes
    root.classList.add(`theme-${theme}`);
    root.classList.add(mode);

    // Save to localStorage
    localStorage.setItem("clima-theme", theme);
    localStorage.setItem("clima-mode", mode);
  }, [theme, mode]);

  const fetchWeather = async (
    method: "coordinates" | "postalCode" | "city",
    params: { lat?: number; lon?: number; postalCode?: string; city?: string },
  ) => {
    setLoading(true);
    setError(null);

    try {
      let data: WeatherData;

      if (method === "coordinates" && params.lat && params.lon) {
        data = await getWeatherByCoordinates(params.lat, params.lon);
      } else if (method === "postalCode" && params.postalCode) {
        data = await getWeatherByPostalCode(params.postalCode);
      } else if (method === "city" && params.city) {
        data = await getWeatherByCity(params.city);
      } else {
        throw new Error("Invalid parameters for weather fetch");
      }

      setWeatherData(data);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";

      if (errorMessage.includes("404")) {
        setError(
          `Location not found. Please check your search terms and try again.`,
        );
      } else if (errorMessage.includes("429")) {
        setError("Too many requests. Please try again in a moment.");
      } else if (errorMessage.includes("401") || errorMessage.includes("403")) {
        setError("API authentication error. Please try again later.");
      } else if (errorMessage.includes("network")) {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else {
        setError(`Failed to load weather data: ${errorMessage}`);
      }

      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load default location on initial render
    const fetchDefaultWeather = async () => {
      const defaultLat = 28.6139; // New Delhi coordinates
      const defaultLon = 77.209;

      const success = await fetchWeather("coordinates", {
        lat: defaultLat,
        lon: defaultLon,
      });

      // If default location fails, try to get user's location
      if (!success && retryCount === 0) {
        try {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              await fetchWeather("coordinates", {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
            },
            (err) => {
              console.error("Geolocation error:", err);
              // Keep the existing error message
            },
          );
        } catch (geoErr) {
          console.error("Geolocation not supported:", geoErr);
        }
      }
    };

    fetchDefaultWeather().catch(console.error);
  }, [retryCount]);

  const handleLocationSelect = async (lat: number, lon: number) => {
    await fetchWeather("coordinates", { lat, lon });
  };

  const handlePostalCodeSearch = async (postalCode: string) => {
    await fetchWeather("postalCode", { postalCode });
  };

  const handleCitySearch = async (city: string) => {
    await fetchWeather("city", { city });
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (!weatherData && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center theme-gradient">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-foreground/80 font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData && error) {
    return (
      <div className="flex min-h-screen items-center justify-center theme-gradient">
        <div className="max-w-md rounded-lg border border-border/30 bg-card/45 p-8 backdrop-blur-md shadow-lg text-center">
          <div className="mb-6 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Error Loading Weather
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/95 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {weatherData && (
        <WeatherBackground weatherData={weatherData}>
          <div className="flex w-full flex-col items-center gap-6">
            <header className="flex w-full max-w-3xl items-center justify-between py-4 border-b border-border/10 mb-2">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3">
                <ClimaLogo className="h-9 w-9 select-none pointer-events-none" />
                <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent select-none">
                  Clima
                </span>
              </div>
              <ThemeSwitcher
                theme={theme}
                setTheme={setTheme}
                mode={mode}
                setMode={setMode}
              />
            </header>

            <LocationSearch
              onLocationSelect={handleLocationSelect}
              onPostalCodeSearch={handlePostalCodeSearch}
              onCitySearch={handleCitySearch}
              isLoading={loading}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full max-w-3xl items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive backdrop-blur-md animate-in slide-in-from-top-2"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
                <button
                  onClick={handleRetry}
                  className="ml-auto rounded-full bg-foreground/10 p-1 hover:bg-foreground/20 text-foreground transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            <CurrentWeather weatherData={weatherData} />

            <Forecast weatherData={weatherData} />

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center text-sm text-muted-foreground"
            >
              <p>Weather data provided by WeatherAPI.com</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <a
                  href="https://github.com/mrd3mon/clima"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  View on GitHub
                </a>
                <p className="">© {new Date().getFullYear()} Clima</p>
              </div>
            </motion.footer>
          </div>
        </WeatherBackground>
      )}
    </>
  );
}
