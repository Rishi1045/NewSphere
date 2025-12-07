import React, { useState, useEffect } from 'react';
import { BsCloudSun, BsSun, BsCloudRain, BsSnow } from 'react-icons/bs';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
                    );
                    const data = await response.json();
                    setWeather(data.current_weather);
                } catch (error) {
                    console.error("Weather fetch failed", error);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.log("Location access denied, defaulting to NY");
                // Default to New York if denied
                fetchDefaultWeather();
            }
        );
    }, []);

    const fetchDefaultWeather = async () => {
        try {
            // NY Coordinates
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.00&current_weather=true`
            );
            const data = await response.json();
            setWeather(data.current_weather);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="animate-pulse w-16 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>;
    if (!weather) return null;

    const getWeatherIcon = (code) => {
        if (code <= 3) return <BsSun className="text-yellow-500" />;
        if (code <= 60) return <BsCloudSun className="text-zinc-500" />;
        if (code <= 80) return <BsCloudRain className="text-blue-500" />;
        return <BsSnow className="text-cyan-500" />;
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 shadow-sm">
            {getWeatherIcon(weather.weathercode)}
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {Math.round(weather.temperature)}°C
            </span>
        </div>
    );
};

export default WeatherWidget;
