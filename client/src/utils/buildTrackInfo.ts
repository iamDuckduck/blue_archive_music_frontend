import type { Track } from "../context/audio-player-context";
import type OstPage from "../entities/OstPage";
import APIClient from "../service/api-client";

export const buildTrackInfo = async (
  audioEndpoint: string,
  imageEndpoint: string,
  id: string | number,
  targetTrack: OstPage
): Promise<Track> => {
  const audioApiClient = new APIClient<string>(audioEndpoint);
  const imageApiClient = new APIClient<string>(imageEndpoint);

  const url = await audioApiClient.getAudioOst(id);

  const image = await imageApiClient.getImageOst(id);

  const currentTrackInfo = {
    id: targetTrack?.id || 0,
    name: targetTrack?.name || "",
    src: url || "",
    author: targetTrack?.author || "",
    thumbnail: image,
  };

  return currentTrackInfo;
};
