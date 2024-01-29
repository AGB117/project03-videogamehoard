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

      const { data, error } = await supabase
        .from("games")
        .update({ finishedplaying: nowDateFormatted })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();
    }

    if (status === "currently playing") {
      const nowDate = new Date();
      const nowDateFormatted = `${nowDate.getFullYear()}-${String(
        nowDate.getMonth() + 1
      ).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

      console.log("nowDateFormatted", nowDateFormatted);

      const { data, error } = await supabase
        .from("games")
        .update({ startedplaying: nowDateFormatted })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();

      console.log("game if for complete is working", status);
    }
    /////////////////////////////////////////////////////////////
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
    try {
      //handler for changing the game collection
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

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
    try {
      //handler for changing the game collection
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("games")
        .update({ status: statusChange })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", userData.name)
        .select();

      /////////////////////////////////////////////////////////////////
      /////////////////////////mark//////////////////

      //i have a column in supabase called startedplaying and a column called finished playing
      //when that status changes to currently playing print a date on started playing column and read it for the singlegamepage
      //if the game is moved to finishedplaying print a date to that column and display it on the singlemgame page
      //later add a way to edit those dates
      //////
      // console.log("status changed to ", statusChange);
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

        console.log("nowDateFormatted", nowDateFormatted);

        const { data, error } = await supabase
          .from("games")
          .update({ startedplaying: nowDateFormatted })
          .eq("user_id", user?.id)
          .eq("game_info ->> gameName", userData.name)
          .select();

        console.log("game if for complete is working", statusChange);
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

  const formattedDateReleased: string = formatDate(userData.released);

  const dateAdded = gameObject.map((game) => game.dateadded);
  const dateStartedPlaying = gameObject.map((game) => game.startedplaying);
  const dateFinishedPlaying = gameObject.map((game) => game.finishedplaying);

  const dateAddedExists = dateAdded.length !== 0 ? true : false;
  const dateStartedPlayingExists =
    dateStartedPlaying.length !== 0 && dateStartedPlaying[0] !== null
      ? true
      : false;
  const dateFinishedPlayingExists =
    dateFinishedPlaying.length !== 0 && dateFinishedPlaying[0] !== null
      ? true
      : false;

  ///////
  console.log(
    "valid of invalid date finished",
    dateFinishedPlaying,
    dateFinishedPlaying.length,
    dateFinishedPlayingExists
  );
  /////
  const formattedDateAdded: string = formatDate(dateAdded.toString());
  const formattedStartedPlaying: string = formatDate(
    dateStartedPlaying.toString()
  );
  const formattedFinishedPlaying: string = formatDate(
    dateFinishedPlaying.toString()
  );

  return (
    <Fragment>
      <div className={classes.container}>
        {noGameInfo && (
          <Fragment>
            <div className={classes.leftSide}>
              <div className={classes.imageContainer}>
                <img src={userData.background_image} alt="game image" />
              </div>

              <div className={classes.collecitonContainer}>
                {gameExists && (
                  <div className={classes.collection}>
                    <span>In your library</span>
                  </div>
                )}

                {gameInCollection ? (
                  <div className={classes.collection}>
                    <Link
                      href="/collections/[collectionid]"
                      as={`/collections/${encodeURIComponent(
                        gameCollectionName
                      )}`}
                    >{`${gameCollection}`}</Link>
                  </div>
                ) : (
                  <div className={classes.collection}>
                    <span>No collection</span>
                  </div>
                )}
              </div>

              {/*colleciton and status handlerss*/}
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

                {/* {gameExists && (
                  <div className={classes.collection}>
                    <span>In your library</span>
                  </div>
                )} */}
              </div>
            </div>

            <div className={classes.rightSide}>
              <div className={classes.heading}>
                <h1 className={classes.name}>{userData.name}</h1>
              </div>

              <p>{userData.description_raw}</p>
              <p>Released on {formattedDateReleased}</p>

              <ul>
                <li>Platforms:</li>
                {userData.platforms.map(
                  (platform: {
                    platform: { name: string };
                    released_at: string;
                  }) => (
                    <li key={Math.random()}>{` ${platform.platform.name}`}</li>
                  )
                )}
              </ul>

              {dateAddedExists && (
                <div className={classes.dateAdded}>
                  <p>Added to library on {formattedDateAdded}</p>
                </div>
              )}

              {<p>My activity</p>}
              <p>Started playing on</p>
              {dateStartedPlayingExists && (
                <div className={classes.dateAdded}>
                  {formattedStartedPlaying}
                </div>
              )}
              <p>Finished playing on</p>
              {dateFinishedPlayingExists && (
                <div className={classes.dateAdded}>
                  {formattedFinishedPlaying}
                </div>
              )}

              {/*delete game*/}
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
