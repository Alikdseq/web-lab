import axios from "axios";

// 🌍 Погода по координатам от GeoNames
export const getWeatherByCoords = async (lat, lon) => {
  const username = "AlikHan2102"; // 🔴 заменишь на свой username с geonames.org
  const url = `https://secure.geonames.org/findNearByWeatherJSON?lat=${lat}&lng=${lon}&username=${username}`;
  const { data } = await axios.get(url);
  return data.weatherObservation;
};

// 📅 Проверка: сегодня выходной? (0 — рабочий, 1 — выходной)
export const isTodayDayOff = async () => {
  const { data } = await axios.get("https://isdayoff.ru/today");
  return data.trim() === "1"; // true — выходной
};
