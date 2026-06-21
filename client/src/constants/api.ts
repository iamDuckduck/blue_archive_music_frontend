export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
export const OST_PAGE_URL = "/user/ost/page";
export const OST_LIST_URL = "/user/ost/list";
export const OST_AUDIO_ENDPOINT = "/user/ost/audio";
export const OST_IMAGE_ENDPOINT = "/user/ost/image";
export const OST_TYPE_BASE_ENDPOINT = "user/ostType";
export const SONG_PLAY_COUNT_ENDPOINT = (songId: number) =>
  `/user/song/${songId}/play`;
export const PUBLIC_URL_PREFIX =
  import.meta.env.VITE_PUBLIC_MEDIA_BASE_URL ??
  "https://pub-185cd71ac9b44750afc23319e9e08130.r2.dev/";
