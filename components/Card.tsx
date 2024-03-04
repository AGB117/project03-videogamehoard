import classes from "./Card.module.css";
import Link from "next/link";
import ImageLoader from "./ImageLoader";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

type Card = {
  gameId: number;
  gameName: string;
  gameImg: string;
  gameRating: number;
  gameDate: string | null;
  gameGenre: Genre[];
};

type Genre = {
  id: string;
  name: string;
};

async function Card({
  gameId,
  gameName,
  gameImg,
  gameRating,
  gameDate,
  gameGenre,
}: Card) {
  /////display status and collection if the game is in your collection
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userStatusCollection } = await supabase
    .from("games")
    .select()
    .eq("user_id", user?.id)
    .eq("game_info ->> gameName", gameName);

  const status =
    (userStatusCollection?.map((game) => game.status).toString() as string) ??
    "";
  const collection =
    (userStatusCollection
      ?.map((game) => game.collection)
      .toString() as string) ?? "";

  const inCollection = collection === "" && status === "" ? false : true;
  // const statusExists = status !== "" ? true : false;
  const collectionExists = collection !== "" ? true : false;

  //format date
  function formatDate(inputDate: string | null): string {
    if (inputDate === null) {
      const formattedDate: string = "No release date";
      return formattedDate;
    }

    const parts: number[] | null = inputDate
      .split("-")
      .map((part) => parseInt(part, 10));
    const [year, month, day] = parts;

    const dateObject: Date = new Date(year, month - 1, day);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate: string = dateObject.toLocaleDateString(
      "en-US",
      options
    );

    return formattedDate;
  }

  const formattedDate: string = formatDate(gameDate);

  return (
    <div className={classes.card}>
      <Link
        href="/videogames/[singlegamepage]/[gameid]"
        as={`/videogames/${gameName}/${gameId}`}
      >
        {gameImg ? (
          <div className={classes.imageContainer}>
            <ImageLoader image={gameImg} />
          </div>
        ) : (
          <div className={classes.imgNotFound}>Image not Found!</div>
        )}
      </Link>
      <h1>{gameName}</h1>

      <div className={classes.ratingDate}>
        <div className={classes.rating}>Rating: {gameRating}/5</div>
        <div className={classes.date}>{formattedDate}</div>
      </div>

      {inCollection && (
        <div className={classes.statusCollectionContainer}>
          <div className={classes.collectionStatus}>
            <Link
              href="/collections/[collectionid]"
              as={`/collections/${encodeURIComponent(status)}`}
            >
              {status
                .split(" ")
                .map(
                  (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")}
            </Link>
          </div>
          <div className={classes.collectionStatus}>
            {collectionExists ? (
              <Link
                href="/collections/[collectionid]"
                as={`/collections/${encodeURIComponent(collection)}`}
              >{`${collection}`}</Link>
            ) : (
              "No collection"
            )}
          </div>
        </div>
      )}

      <div className={classes.generes}>
        <ul>
          {gameGenre.map((genere: Genre) => (
            <li key={genere.id}>{genere.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Card;
