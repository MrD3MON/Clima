"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { type WeatherData } from "~/lib/weather-api";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Umbrella,
  Wind,
  Thermometer,
} from "lucide-react";

interface ForecastProps {
  weatherData: WeatherData;
}

export function Forecast({ weatherData }: ForecastProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  // Helper function to get weather icon based on condition code
  const getWeatherIcon = (code: number, isDay: boolean) => {
    // Clear
    if (code === 1000) {
      return <Sun className="h-6 w-6 text-yellow-400" />;
    }
    // Cloudy conditions
    if (code >= 1003 && code <= 1030) {
      return <Cloud className="h-6 w-6 text-slate-400" />;
    }
    // Rain
    if ((code >= 1063 && code <= 1069) || (code >= 1180 && code <= 1201)) {
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    }
    // Snow
    if (code >= 1210 && code <= 1225) {
      return <CloudSnow className="h-6 w-6 text-slate-200" />;
    }
    // Default
    return <Cloud className="h-6 w-6 text-slate-400" />;
  };

  // Format date to display day of week
  const formatDay = (date: string) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const d = new Date(date);
    return dayNames[d.getDay()];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto mt-8 w-full max-w-4xl"
    >
      <h2 className="mb-4 text-2xl font-bold text-foreground">Weather Forecast</h2>
      <Tabs defaultValue="day-0" className="w-full">
        <TabsList className="w-full bg-card/45 border border-border/20 backdrop-blur-md h-12 p-1">
          {weatherData.forecast.forecastday.slice(0, 3).map((day, index) => (
            <TabsTrigger
              key={day.date}
              value={`day-${index}`}
              className="w-full text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-foreground text-muted-foreground transition-all duration-300"
            >
              {index === 0 ? "Today" : formatDay(day.date)?.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {weatherData.forecast.forecastday.slice(0, 3).map((day, index) => (
          <TabsContent key={day.date} value={`day-${index}`}>
            <Card className="h-full w-full border border-border/30 bg-card/45 text-foreground backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <span>{day.date}</span>
                  <Badge
                    variant="outline"
                    className="border-primary/50 bg-primary/10 text-primary"
                  >
                    {day.day.condition.text}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-3 text-primary">
                        {getWeatherIcon(day.day.condition.code, true)}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-foreground">
                          {day.day.avgtemp_c}°C
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Average Temperature
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-foreground">
                      <div>
                        <div className="font-medium text-muted-foreground">Min</div>
                        <div className="text-xl font-bold">{day.day.mintemp_c}°C</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Max</div>
                        <div className="text-xl font-bold">{day.day.maxtemp_c}°C</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Temperature Range */}
                      <div className="flex items-center gap-2 rounded-lg border border-border/20 bg-muted/40 p-3 backdrop-blur-sm">
                        <Thermometer className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Temperature
                          </div>
                          <div className="text-sm font-semibold text-foreground">
                            {day.day.mintemp_c}° - {day.day.maxtemp_c}°
                          </div>
                        </div>
                      </div>

                      {/* Wind Speed */}
                      <div className="flex items-center gap-2 rounded-lg border border-border/20 bg-muted/40 p-3 backdrop-blur-sm">
                        <Wind className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Wind</div>
                          <div className="text-sm font-semibold text-foreground">{day.day.maxwind_kph} km/h</div>
                        </div>
                      </div>
                    </div>

                    {/* Rain Chance with Progress Bar */}
                    <div className="rounded-lg border border-border/20 bg-muted/40 p-3 backdrop-blur-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CloudRain className="h-5 w-5 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Chance of Rain
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {day.day.daily_chance_of_rain}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${day.day.daily_chance_of_rain}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-border/20" />

                <div>
                  <h3 className="mb-2 text-sm font-medium text-foreground">Hourly Forecast</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {day.hour
                      .filter((_, i) => i % 3 === 0) // Show every 3 hours
                      .map((hour, i) => (
                        <div
                          key={i}
                          className="w-20 flex-shrink-0 rounded-lg border border-border/20 bg-muted/40 p-2 text-center"
                        >
                          <div className="text-xs text-muted-foreground">
                            {new Date(hour.time).getHours()}:00
                          </div>
                          <div className="my-1 flex justify-center">
                            {getWeatherIcon(
                              hour.condition.code,
                              new Date(hour.time).getHours() >= 6 &&
                                new Date(hour.time).getHours() < 18,
                            )}
                          </div>
                          <div className="font-semibold text-foreground">{hour.temp_c}°C</div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
