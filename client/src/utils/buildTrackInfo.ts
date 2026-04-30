import { PUBLIC_URL_PREFIX } from "../constants/api";
import type { Track } from "../store/audioPlayerStore";
import type OstPage from "../entities/OstPage";

export const buildTrackInfo = (targetTrack: OstPage): Track => {
  return {
    id: targetTrack?.id || 0,
    name: targetTrack?.name || "",
    src: PUBLIC_URL_PREFIX + targetTrack.audio_path || "",
    author: targetTrack?.author || "",
    thumbnail: PUBLIC_URL_PREFIX + targetTrack.image_path,
  };
};
