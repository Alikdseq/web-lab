import axios from "axios";

export async function getWeatherByCoords(lat, lng) {
  try {
    const response = await axios.get(
      `https://secure.geonames.org/findNearByWeatherJSON`,
      {
        params: {
          lat,
          lng,
          username: "AlikHan2102", // убедись, что этот username активен
        },
      }
    );

    const data = response.data.weatherObservation;

    return {
      temperature: data.temperature,
      windSpeed: data.windSpeed,
      clouds: data.clouds,
    };
  } catch (error) {
    console.error("Ошибка при получении погоды:", error);
    throw error;
  }
}

export async function isTodayDayOff() {
  try {
    const response = await axios.get("https://isdayoff.ru/today?cc=ru");
    const data = response.data;

    // Убедимся, что это строка, иначе trim() выдаст ошибку
    const result = String(data).trim();

    console.log("DayOff API вернул:", result);

    return result === "1"; // true — выходной, false — рабочий
  } catch (error) {
    console.error("Ошибка при получении данных о выходном дне:", error);
    return null;
  }
}
