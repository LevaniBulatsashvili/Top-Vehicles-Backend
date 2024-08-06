import type Like from "./Likes";
import type Views from "./Views";

type Vehicle = {
  id: number;
  userId: number;
  title: string;
  description: string;
  loc: string;
  price: number;
  img: string;
  // type: [];
  views: Views[];
  likes: Like[];
};

export default Vehicle;
