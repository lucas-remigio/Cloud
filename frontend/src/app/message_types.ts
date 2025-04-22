export type Message = {
  _id: string;
  title: string;
  body: string;
  created_at: Date;
  category: string;
};

export type MessageCreation = {
  message: Message;
};

export type MessageResponse = {
  messages: Message[];
};

export interface MoodResponse {
  feeling: string;
  feedback_message: string;
  category: EmotionCategory;
}
export interface EmotionCategory {
  _id: string;
  name: string;
  category: string;
  description: string;
}
