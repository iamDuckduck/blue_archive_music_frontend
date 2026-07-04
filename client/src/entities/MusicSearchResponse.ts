export interface AlbumSearchResult {
  id: number;
  title: string;
  coverImagePath: string;
}

export interface SongSearchResult {
  id: number;
  title: string;
  albumId: number;
  albumTitle: string;
  imagePath: string;
}

export default interface MusicSearchResponse {
  albums: AlbumSearchResult[];
  songs: SongSearchResult[];
}
