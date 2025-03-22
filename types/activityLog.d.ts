import { User } from "./user";

type ActivityLog = {
  user: User;
  type: "CREATE" | "UPDATE" | "DELETE";
  identifier: string;
  module: string;
  datetime: string;
  object: [
    {
      model: string;
      fields: {
        [key: string]: string;
      };
    },
  ];
  changes: {
    [key: string]: string[];
  };
};
