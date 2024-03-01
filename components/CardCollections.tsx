import classes from "./Card.module.css";
import Link from "next/link";
import ImageLoader from "./ImageLoader";
import { ReactNode } from "react";
import MarkFinishedButton from "./MarkFinishedButton";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

type Card = {
  gameName: string;
  gameId: number;
  collectionid: string;
  children: ReactNode;
  finishedHandler: (gameName: string) => void;
};

type Genere = {
  id: string;
  name: string;
};

async function CardCollections({
  gameId,
  children,
  collectionid,
  finishedHandler,
  gameName,
}: Card) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${gameId}?key=${process.env.RAWG_API_KEY}`
  );
  const rawgData = await response.json();

  ///users game info
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  //this is the row of the game
  const { data: userData } = await supabase
    .from("games")
    .select()
    .eq("user_id", user?.id)
    .eq("game_info ->> gameName", gameName);

  if (!userData) {
    return;
  }

  //status of the game
  const userDataStatus = userData.map((game) => game.status).toString();
  const userDataCollection = userData.map((game) => game.collection).toString();

  const collectionExists = userDataCollection !== "" ? true : false;

  //format date
  function formatDate(inputDate: string): string {
    const parts: number[] = inputDate
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

  if (!rawgData.released) {
    return;
  }

  const formattedDate: string = formatDate(rawgData.released);

  return (
    <div className={classes.card}>
      <MarkFinishedButton
        collectionid={collectionid}
        finishedHandler={finishedHandler}
        gameName={gameName}
      />

      <Link
        href="/videogames/[singlegamepage]/[gameid]"
        as={`/videogames/${rawgData.name}/${rawgData.id}`}
      >
        {rawgData.background_image ? (
          <div className={classes.imageContainer}>
            <ImageLoader image={rawgData.background_image} />
          </div>
        ) : (
          <div className={classes.imgNotFound}>Image not Found!</div>
        )}
      </Link>
      <h1>{rawgData.name}</h1>
      <div className={classes.ratingDate}>
        <div className={classes.rating}>Rating: {rawgData.rating}/5</div>

        <div className={classes.date}>{formattedDate}</div>
      </div>

      {/* test feature status and collection of game in cards */}

      <div className={classes.statusCollectionContainer}>
        <div className={classes.collectionStatus}>
          <Link
            href="/collections/[collectionid]"
            as={`/collections/${encodeURIComponent(userDataStatus)}`}
          >
            {userDataStatus
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
              as={`/collections/${encodeURIComponent(userDataCollection)}`}
            >{`${userDataCollection}`}</Link>
          ) : (
            "No collection"
          )}
        </div>
      </div>
      {/*  */}

      <div className={classes.generes}>
        <ul>
          {rawgData.genres.map((genere: Genere) => (
            <li key={genere.id}>{genere.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CardCollections;
