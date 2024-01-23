import classes from "./Card.module.css";
import Link from "next/link";
import ImageLoader from "./ImageLoader";

type Card = {
  gameId: number;
  gameName: string;
  gameImg: string;
  gameRating: number;
};

type Genere = {
  id: string;
  name: string;
};

async function Card({ gameId, gameName, gameImg, gameRating }: Card) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${gameId}?key=${process.env.RAWG_API_KEY}`
  );
  const userData = await response.json();

  //format date
  function formatDate(inputDate: string): string {
    const parts: number[] = inputDate
      .split("/")
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

  if (!userData.released) {
    return;
  }

  const formattedDate: string = formatDate(
    userData.released.replace(/-/g, "/")
  );

  ///////
  return (
    <div className={classes.card}>
      <Link
        href="/videogames/[singlegamepage]/[gameid]"
        as={`/videogames/${userData.name}/${userData.id}`}
      >
        {userData.background_image ? (
          <div className={classes.imageContainer}>
            <ImageLoader image={userData.background_image} />
          </div>
        ) : (
          <div className={classes.imgNotFound}>Image not Found!</div>
        )}
      </Link>
      <h1>{userData.name}</h1>

      <div className={classes.ratingDate}>
        <div className={classes.rating}>Rating: {userData.rating}/5</div>

        <div className={classes.date}>{formattedDate}</div>
      </div>
      <div className={classes.generes}>
        <ul>
          {userData.genres.map((genere: Genere) => (
            <li key={genere.id}>{genere.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Card;
