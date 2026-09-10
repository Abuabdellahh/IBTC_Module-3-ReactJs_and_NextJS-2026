import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [favoriteClubs, setFavoriteClubs] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [theme, setTheme] = useState("light");

  const toggleFavoriteClub = (clubId) =>
    setFavoriteClubs((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId]
    );

  const toggleFavoriteEvent = (eventId) =>
    setFavoriteEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <AppContext.Provider
      value={{ favoriteClubs, toggleFavoriteClub, favoriteEvents, toggleFavoriteEvent, theme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
