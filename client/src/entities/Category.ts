import type Album from "./Album";

export default interface Category {
  id: number;
  category: string;
  albumList: Album[];
  createdDate: string;
  updatedDate: string;
}
