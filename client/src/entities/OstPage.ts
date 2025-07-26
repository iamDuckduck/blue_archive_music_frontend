export default interface OstPage {
  id: number;
  name: string;
  author: string;
  ostNumber: number;
  audio_path: string;
  ostType: {
    name: string;
    volume: number;
  };
}
