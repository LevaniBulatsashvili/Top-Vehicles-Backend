import type Like from "./Likes";
import type Views from "./Views";

type Vehicle = {
  id: number;
  title: string;
  loc: string;
  price: number;
  img: string;
  views: Views[];
  likes: Like[];
};

export default Vehicle;
