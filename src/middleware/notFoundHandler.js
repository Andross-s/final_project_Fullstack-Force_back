export const notFoundHandler = (req, res) => {
  // Маршрут не знайдено
  res.status(404).json({ message: "Маршрут не знайдено" });
};
