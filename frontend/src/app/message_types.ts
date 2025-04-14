export type Message = {
  _id: string;
  title: string;
  body: string;
  created_at: Date;
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
}
