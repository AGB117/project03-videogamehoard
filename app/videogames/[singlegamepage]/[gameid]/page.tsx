import { redirect } from "next/navigation";
import classes from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import DeleteButton from "@/components/DeleteButton";
import { revalidatePath } from "next/cache";
import CollectionSelector from "@/components/CollectionSelector";
import StatusSelector from "@/components/StatusSelector";
import { Fragment } from "react";
import AddGameForm from "@/components/AddGameForm";
import Link from "next/link";
import RemoveGameFromCollection from "@/components/RemoveGameFromCollection";
import StartedPlaying from "@/components/StartedPlaying";
import Finishedplaying from "@/components/FinishedPlaying";
import ImageLoaderSinglePage from "@/components/ImageLoaderSinglePage";
import CustomRating from "@/components/CustomRating";

type Genre = {
  id: string;
  name: string;
};

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Video Game Hoard | Game Information",
  description: "",
};

async function SinglePageInfo({
  params: { gameid },
}: {
  params: {
    gameid: number;
  };
}) {
  ////fetch from id
  const response = await fetch(
    `https://api.rawg.io/api/games/${gameid}?key=${process.env.RAWG_API_KEY}`
  );

  const userData = await response.json();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!userData) {
    return;
  }

  const noGameInfo = userData ? true : false;

  if (!user) {
    redirect("/login");
  }

  async function addGameHandler(status: string, collection: string) {
    "use server";
    //handler for adding the game to your account
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (!userData) {
      return;
    }

    //////////////dont add if game exists
    const { data: gameInCollection } = await supabase
      .from("games")
      .delete()
      .eq("user_id", user?.id)
      .eq("game_info ->> gameName", userData.name);

    if (gameInCollection) {
      return;
    }

    const { data: newGame } = await supabase.from("games").insert([
      {
        user_id: user?.id,
        game_info: {
          "gameId": userData.id,
          "gameName": userData.name,
          "gameImg": userData.background_image,
          "platforms": userData.platforms,
          "gameRelease": userData.released,
          "gameDescription": userData.description,
        },
        status: status,
        collection: collection,
      },
    ]);
    /////////////////////////////////////////////////////////////
    if (status === "completed") {
      const nowDate = new Date();
      const nowDateFormatted = `${nowDate.getFullYear()}-${String(
        nowDate.getMonth() + 1
      ).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

      const { data: finished, error: error1 } = await supabase
        .from("games")
        .update({ finishedplaying: nowDateFormatted })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
      const { data: started, error: error2 } = await supabase
        .from("games")
        .update({ startedplaying: nowDateFormatted })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    }

    if (status === "currently playing") {
      const nowDate = new Date();
      const nowDateFormatted = `${nowDate.getFullYear()}-${String(
        nowDate.getMonth() + 1
      ).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

      const { data, error } = await supabase
        .from("games")
        .update({ startedplaying: nowDateFormatted })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    }
    if (status === "uncompleted") {
      const nowDate = new Date();
      const nowDateFormatted = `${nowDate.getFullYear()}-${String(
        nowDate.getMonth() + 1
      ).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

      const { data, error } = await supabase
        .from("games")
        .update({ startedplaying: nowDateFormatted })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    }

    revalidatePath(`/videogames/[singlegamepage]/${gameid}`, "page");
  }

  async function deleteGameHandler() {
    "use server";
    //handler for adding the game to your account
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (!userData) {
      return;
    }

    try {
      const { error } = await supabase
        .from("games")
        .delete()
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        if ("code" in error) {
          console.log((error as { code: string }).code);
          alert((error as { code: string }).code);
        }
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred");
      }
    }

    revalidatePath(`/videogames/[singlegamepage]/${gameid}`, "page");
  }

  async function removeCollectionHandler() {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    ///// this one clear the collection from the game line
    try {
      const { data: clearCollection, error } = await supabase
        .from("games")
        .update({ collection: "" })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        if ("code" in error) {
          console.log((error as { code: string }).code);
          alert((error as { code: string }).code);
        }
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred");
      }
    }

    revalidatePath("/videogames/[singlegamepage]/[gameid]", "page");
  }

  //this is the row of the game
  const { data: gameObject } = await supabase
    .from("games")
    .select()
    .eq("user_id", user?.id)
    .eq("game_info ->> gameName", userData.name);

  if (!gameObject) {
    return;
  }

  //filtered array FOR THE DROPDOWN MENU
  const { data: games, error } = await supabase
    .from("games")
    .select()
    .eq("user_id", user.id);

  if (error?.message) throw new Error("Database could not be reached");

  if (!games) {
    return;
  }

  //filter collections
  const arrayCollection: string[] = games.map((games) => games.collection);
  //remove null and empty
  const filteredCollectionArray = arrayCollection.filter((obj) =>
    Object.values(obj).some((value) => value !== "" && value !== null)
  );

  //set new array to remove duplicates
  const filteredArray: string[] = [
    ...new Set(
      filteredCollectionArray.sort((a, b) => a[0].localeCompare(b[0]))
    ),
  ];

  async function changeCollectionHandler(collectionChange: string) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
      //handler for changing the game collection

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("games")
        .update({ collection: collectionChange })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();

      revalidatePath("/videogames/[singlegamepage]/[gameid]", "page");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        if ("code" in error) {
          console.log((error as { code: string }).code);
          alert((error as { code: string }).code);
        }
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred");
      }
    }
  }

  async function changeStatusHandler(statusChange: string) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
      //handler for changing the game status

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("games")
        .update({ status: statusChange })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();

      if (statusChange === "completed") {
        const nowDate = new Date();
        const nowDateFormatted = `${nowDate.getFullYear()}-${String(
          nowDate.getMonth() + 1
        ).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

        const { data, error } = await supabase
          .from("games")
          .update({ finishedplaying: nowDateFormatted })
          .eq("user_id", user?.id)
          .eq("game_info ->> gameName", userData.name)
          .select();
      }

      if (statusChange === "currently playing") {
        const nowDate = new Date();
        const nowDateFormatted = `${nowDate.getFullYear()}-${String(
          nowDate.getMonth() + 1
        ).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

        const { data, error } = await supabase
          .from("games")
          .update({ startedplaying: nowDateFormatted })
          .eq("user_id", user?.id)
          .eq("game_info ->> gameName", userData.name)
          .select();
      }
      revalidatePath("/videogames/[singlegamepage]/[gameid]", "page");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        if ("code" in error) {
          console.log((error as { code: string }).code);
          alert((error as { code: string }).code);
        }
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred");
      }
    }
  }

  async function ChangeStartedPlayingDate(date: string) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (!user) {
      return;
    }

    try {
      const { data: renameCollection, error } = await supabase
        .from("games")
        .update({ startedplaying: date })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        if ("code" in error) {
          console.log((error as { code: string }).code);
          alert((error as { code: string }).code);
        }
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred");
      }
    }

    revalidatePath("/videogames/[singlegamepage]/[gameid]", "page");
  }

  async function ChangeFinishedPlayingDate(date: string) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (!user) {
      return;
    }

    try {
      const { data: renameCollection, error } = await supabase
        .from("games")
        .update({ finishedplaying: date })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        if ("code" in error) {
          console.log((error as { code: string }).code);
          alert((error as { code: string }).code);
        }
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred");
      }
    }

    revalidatePath("/videogames/[singlegamepage]/[gameid]", "page");
  }

  async function ChangeCustomRating(rating: number) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (!rating) {
      return;
    }

    try {
      const { data: customRating, error } = await supabase
        .from("games")
        .update({ customrating: rating })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        if ("code" in error) {
          console.log((error as { code: string }).code);
          alert((error as { code: string }).code);
        }
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred");
      }
    }

    revalidatePath("/videogames/[singlegamepage]/[gameid]", "page");
  }

  //this is to check if the game exists in your collection
  const { data: owned, error: errorOwnedGame } = await supabase
    .from("games")
    .select()
    .eq("user_id", user?.id)
    .eq("game_info ->> gameName", userData.name);

  const gameExists = owned?.length ? true : false;

  const gameCollection: string | undefined = owned
    ?.map((gameObj) => gameObj.collection)
    .toString();
  const gameCollectionName =
    typeof gameCollection === "string" ? gameCollection : "null";
  const gameInCollection = gameCollection?.length ? true : false;

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

  const formattedDateReleased: string | null = formatDate(userData.released);

  const dateAdded = gameObject.map((game) => game.dateadded);
  const dateStartedPlaying = gameObject.map((game) => game.startedplaying);
  const dateFinishedPlaying = gameObject.map((game) => game.finishedplaying);
  const customRating = gameObject.map((game) => game.customrating);

  const dateAddedExists = dateAdded.length !== 0 ? true : false;
  const dateStartedPlayingExists =
    dateStartedPlaying.length !== 0 && dateStartedPlaying[0] !== null
      ? true
      : false;
  const dateFinishedPlayingExists =
    dateFinishedPlaying.length !== 0 && dateFinishedPlaying[0] !== null
      ? true
      : false;

  const customRatingExists =
    customRating.length !== 0 && customRating[0] !== null ? true : false;

  const formattedDateAdded: string = formatDate(dateAdded.toString());
  const formattedStartedPlaying: string = formatDate(
    dateStartedPlaying.toString()
  );
  const formattedFinishedPlaying: string = formatDate(
    dateFinishedPlaying.toString()
  );

  const currentStatus = gameObject
    ?.map((gameStatus) => gameStatus.status.replace(/\s+/g, ""))
    .toString();

  const imageExists = userData.background_image ? true : false;

  return (
    <Fragment>
      <div className={classes.container}>
        {noGameInfo && (
          <Fragment>
            <div className={classes.leftSide}>
              {imageExists ? (
                <div className={classes.imageContainer}>
                  <ImageLoaderSinglePage image={userData.background_image} />
                </div>
              ) : (
                <div className={classes.imgNotFound}>Image not Found!</div>
              )}

              {/*collection and status handlerss*/}
              <div className={classes.handlers}>
                {gameExists && (
                  <Fragment>
                    <form>
                      <label htmlFor="statusDropdown">Status </label>
                      <StatusSelector changeStatusHandler={changeStatusHandler}>
                        <option>
                          {gameObject?.map((gameStatus) =>
                            gameStatus.status
                              .split(" ")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          )}
                        </option>
                      </StatusSelector>

                      <label htmlFor="collectionDropdown">Collection</label>

                      <CollectionSelector
                        filteredArrayCollection={filteredArray}
                        changeCollectionHandler={changeCollectionHandler}
                      >
                        <option key={Math.random()}>
                          {gameObject?.map(
                            (gameCollection) => gameCollection.collection
                          )}
                        </option>
                      </CollectionSelector>
                    </form>
                  </Fragment>
                )}

                {!gameExists && (
                  <div className={classes.buttonAdd}>
                    <AddGameForm
                      filteredArrayCollection={filteredArray}
                      addGameHandler={addGameHandler}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={classes.rightSide}>
              <div className={classes.heading}>
                <h1 className={classes.name}>{userData.name}</h1>
              </div>

              <p>{userData.description_raw}</p>

              {/* start information grid here */}
              <div className={classes.infoGrid}>
                <div>
                  <h1>Released</h1> {formattedDateReleased}
                </div>

                <div>
                  <h1>Genres</h1>
                  <ul>
                    {userData.genres.map((genres: Genre) => (
                      <li key={genres.id}> {genres.name}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h1>Platforms</h1>

                  <ul>
                    {userData.platforms.map(
                      (platform: {
                        platform: { name: string };
                        released_at: string;
                      }) => (
                        <li
                          key={Math.random()}
                        >{` ${platform.platform.name}`}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h1>ESRB</h1>
                  <div>
                    {userData.esrb_rating
                      ? userData.esrb_rating.name
                      : "No ESRB"}
                  </div>
                </div>

                <div>
                  <h1>Publisher</h1>
                  <ul>
                    {userData.publishers.length !== 0
                      ? userData.publishers.map(
                          (publisher: { id: string; name: string | null }) => (
                            <li key={publisher.id}>{publisher.name}</li>
                          )
                        )
                      : "No publishers"}
                  </ul>
                </div>

                <div>
                  <h1>Metascore</h1>
                  <div className={classes.meta}>
                    <a href={userData.metacritic_url}>
                      <img src="/Mcrop.png" />
                    </a>
                    {userData.metacritic !== null ? (
                      <div>
                        <p>{userData.metacritic}/100</p>
                      </div>
                    ) : (
                      "No score"
                    )}
                  </div>
                </div>

                <div>
                  <h1>Rating</h1>
                  <p>{userData.rating}/5</p>
                </div>

                <div>
                  <h1> Your Rating</h1>
                  {gameExists ? (
                    <>
                      {customRatingExists ? (
                        <span className={classes.dateAdded}>
                          {customRating}/100
                          <CustomRating
                            ChangeCustomRating={ChangeCustomRating}
                          />
                        </span>
                      ) : (
                        <div className={classes.notInCollection}>
                          No rating yet
                          <CustomRating
                            ChangeCustomRating={ChangeCustomRating}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={classes.notInCollection}>
                      Not in library
                    </div>
                  )}
                </div>

                <div>
                  <h1>Added to library</h1>
                  {gameExists ? (
                    <>
                      {dateAddedExists && (
                        <div className={classes.dateAdded}>
                          <div>{formattedDateAdded}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={classes.notInCollection}>
                      Not in library
                    </div>
                  )}
                </div>

                <div>
                  <h1> Collection</h1>
                  {gameInCollection ? (
                    <>
                      <Link
                        href="/collections/[collectionid]"
                        as={`/collections/${encodeURIComponent(
                          gameCollectionName
                        )}`}
                      >{`${gameCollection}`}</Link>
                    </>
                  ) : (
                    <div className={classes.notInCollection}>
                      Not in collection
                    </div>
                  )}
                </div>

                <div>
                  <h1> Started playing</h1>
                  {dateStartedPlayingExists && gameExists && (
                    <span className={classes.dateAdded}>
                      {formattedStartedPlaying}
                      <StartedPlaying
                        ChangeStartedPlayingDate={ChangeStartedPlayingDate}
                      />
                    </span>
                  )}
                </div>

                <div>
                  <h1>Finished playing</h1>
                  {dateFinishedPlayingExists &&
                    currentStatus === "completed" && (
                      <span className={classes.dateAdded}>
                        {formattedFinishedPlaying}
                        <Finishedplaying
                          ChangeFinishedPlayingDate={ChangeFinishedPlayingDate}
                        />
                      </span>
                    )}
                </div>
                <div className={classes.buttonDelete}>
                  {gameExists && (
                    <DeleteButton deleteGameHandler={deleteGameHandler} />
                  )}
                </div>
                <div className={classes.buttonDelete}>
                  {gameExists && (
                    <RemoveGameFromCollection
                      removeCollectionHandler={removeCollectionHandler}
                    />
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        )}

        {/* if there is no game info */}
        {!noGameInfo && (
          <>
            <p>there is no game info</p>
          </>
        )}
      </div>
    </Fragment>
  );
}

export default SinglePageInfo;
