import { User } from "./user";

type ActivityLog = {
  user: User;
  type: "CREATE" | "UPDATE" | "DELETE";
  identifier: string;
  module: string;
  dateTime: string;
  changes: {
    [key: string]: string[];
  };
};
