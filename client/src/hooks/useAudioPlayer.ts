import type { GridRowId } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { OST_AUDIO_ENDPOINT } from "../config/api";

const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRow, setActiveRow] = useState<GridRowId>("");
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAudio = async (rowId: GridRowId) => {
    try {
      const response = await fetch(`${OST_AUDIO_ENDPOINT}/${rowId}`);
      return await response.text();
    } catch (error) {
      console.error("Failed to fetch audio:", error);
    }
  };

  const handlePlayButtonClick = async (rowId: GridRowId) => {
    audioRef.current?.pause();
    if (rowId === activeRow && isPlaying) {
      setIsPlaying(false);
      setActiveRow("");
    } else {
      setActiveRow(rowId);
      setIsPlaying(true);
      const url = await fetchAudio(rowId);
      setAudioUrl(url);
    }
  };

  const handleEnded = () => {
    setActiveRow("");
    setIsPlaying(false);
  };

  // url is a cached url so depending isPlaying alone causes bug
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleLoaded = () => {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    };

    if (isPlaying) {
      audio.addEventListener("loadeddata", handleLoaded, { once: true });
      audio.load();
    }

    return () => {
      audio.removeEventListener("loadeddata", handleLoaded);
    };
  }, [isPlaying, audioUrl]);

  return {
    isPlaying,
    activeRow,
    audioUrl,
    audioRef,
    handleEnded,
    handlePlayButtonClick,
  };
};

export default useAudioPlayer;

// import type { GridRowId } from "@mui/x-data-grid";
// import { useEffect, useRef, useState } from "react";
// import { OST_AUDIO_ENDPOINT } from "../config/api";

// const useAudioPlayer = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [activeRow, setActiveRow] = useState<GridRowId>("");
//   const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const fetchAudio = async (rowId: GridRowId) => {
//     try {
//       const response = await fetch(`${OST_AUDIO_ENDPOINT}/${rowId}`);
//       return await response.text();
//     } catch (error) {
//       console.error("Failed to fetch audio:", error);
//       throw error; // Rethrow to handle in caller
//     }
//   };

//   const handlePlayButtonClick = async (rowId: GridRowId) => {
//     audioRef.current?.pause();
//     if (rowId === activeRow && isPlaying) {
//       setIsPlaying(false);
//       setActiveRow("");
//     } else {
//       setActiveRow(rowId);
//       setIsPlaying(true);
//       try {
//         // Avoid refetching if the URL is already set for this row
//         if (rowId !== activeRow || !audioUrl) {
//           const url = await fetchAudio(rowId);
//           setAudioUrl(url);
//         } else {
//           audioRef.current?.load(); // Reuse existing URL
//         }
//       } catch (error) {
//         setIsPlaying(false);
//         setActiveRow("");
//       }
//     }
//   };

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio || !audioUrl) return;

//     const handleLoaded = () => {
//       audio.play().catch((err) => {
//         console.error("Playback failed:", err);
//         setIsPlaying(false);
//       });
//     };

//     if (isPlaying) {
//       audio.addEventListener("loadeddata", handleLoaded, { once: true });
//       audio.load();
//     }

//     return () => {
//       audio.removeEventListener("loadeddata", handleLoaded);
//     };
//   }, [isPlaying, audioUrl]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleEnded = () => {
//       setIsPlaying(false);
//       setActiveRow("");
//     };

//     audio.addEventListener("ended", handleEnded);
//     return () => {
//       audio.removeEventListener("ended", handleEnded);
//     };
//   }, []);

//   return {
//     isPlaying,
//     activeRow,
//     audioUrl,
//     audioRef,
//     setActiveRow,
//     handlePlayButtonClick,
//   };
// };

// export default useAudioPlayer;
