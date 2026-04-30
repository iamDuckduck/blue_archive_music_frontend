import { useEffect, useMemo, useState } from "react";

const useNowClock = () => {
  const [time, setTime] = useState("");

  const tzLabel = useMemo(() => {
    const offsetMin = -new Date().getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMin);
    const hh = Math.floor(abs / 60);
    const mm = abs % 60;
    return mm === 0
      ? `UTC${sign}${hh}`
      : `UTC${sign}${hh}:${String(mm).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return { time, tzLabel };
};

export default useNowClock;
