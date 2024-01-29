"use client";
import classes from "./Card.module.css";
import Link from "next/link";
import ImageLoader from "./ImageLoader";

type Card = {
  gameId: number;
  gameName: string;
  gameImg: string;
  gameRating: number;
  gameDate: string;
  gameGenere: Genere[];
};

type Genere = {
  id: string;
  name: string;
};

function Card({
  gameId,
  gameName,
  gameImg,
  gameRating,
  gameDate,
  gameGenere,
}: Card) {
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

  if (!gameDate) {
    return;
  }

  const formattedDate: string = formatDate(gameDate);

  ///////
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
      <div className={classes.generes}>
        <ul>
          {gameGenere.map((genere: Genere) => (
            <li key={genere.id}>{genere.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Card;
