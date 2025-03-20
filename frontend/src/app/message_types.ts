export type Message = {
  _id: string;
  title: string;
  body: string;
};

export type MessageCreation = {
  message: Message;
};
