import { Tweet as ITweet } from "@prisma/client";
import Link from "next/link";
import { cls } from "@lib/client/utils";

interface ITweetWithLikesAndUser extends ITweet {
  _count: { likes: number };
  user: { username: string };
}

interface IProp {
  tweet: ITweetWithLikesAndUser;
}

const Tweet = ({ tweet }: IProp) => {
  return (
    <Link href={`/tweet/${tweet.id}`}>
      <div
        className={cls(
          "bg-white rounded-lg shadow px-4 py-2 cursor-pointer",
          "dark:bg-slate-700 "
        )}
      >
        <div
          className={cls(
            "flex justify-between items-center w-full",
            "md:flex-col"
          )}
        >
          <h3 className="w-2/3 text-lg truncate md:w-full">{tweet.text}</h3>
          <div
            className={cls(
              "w-1/3 flex flex-col items-end",
              "md:flex-row md:justify-between md:w-full"
            )}
          >
            <span className="text-sm ">{tweet.user.username}</span>
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span>{tweet._count.likes}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Tweet;
