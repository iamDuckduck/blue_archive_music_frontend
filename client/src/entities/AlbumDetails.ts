import type Song from "./Song";

export default interface AlbumDetails {
  id: number;
  title: string;
  coverImagePath: string;
  releaseDate: string;
  description: string;
  songList: Song[];
  createdDate: string;
  updatedDate: string;
}
