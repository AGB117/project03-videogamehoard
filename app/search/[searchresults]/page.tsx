import classes from "./page.module.css";
import { Fragment } from "react";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";

export type GameList = {
  name: string;
  id: number;
  background_image: string;
  platforms: [{ platform: { id: number; slug: string; name: string } }];
  released: string;
  slug: string;
  rating: number;
  genres: [
    {
      id: string;
      name: string;
    }
  ];
};

// type platform = { platform: { id: number; slug: string; name: string } };

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Video Game Hoard | Search Results",
  description: "",
};

async function SearchResults({
  params: { searchresults },
}: {
  params: {
    searchresults: string;
  };
}) {
  const response = await fetch(
    `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page=1&page_size=30&search=${searchresults}`,
    {}
  );

  const userData = await response.json();

  const gameResults = userData.results;
  console.log("search results", gameResults);

  return (
    <Fragment>
      <div className={classes.searchContainer}>
        <SearchBar />
      </div>
      <div className={classes.results}>
        <div className={classes.games}>
          {gameResults.map((game: GameList) => (
            <div key={game.id}>
              <Card
                gameId={game.id}
                gameName={game.name}
                gameImg={game.background_image}
                gameRating={game.rating}
                gameDate={game.released}
                gameGenre={game.genres}
              />
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
export default SearchResults;
