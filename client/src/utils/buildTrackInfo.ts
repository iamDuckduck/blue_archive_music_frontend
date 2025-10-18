import { PUBLIC_URL_PREFIX } from "../constants/api";
import type { Track } from "../context/audio-player-context";
import type Ost from "../entities/OstPage";

export const buildTrackInfo = (targetTrack: Ost): Track => {
  return {
    id: targetTrack?.id || 0,
    name: targetTrack?.name || "",
    src: PUBLIC_URL_PREFIX + targetTrack.audio_path || "",
    author: targetTrack?.author || "",
    thumbnail: PUBLIC_URL_PREFIX + targetTrack.image_path,
  };
};
