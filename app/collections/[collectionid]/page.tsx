import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import classes from "./page.module.css";
import { Fragment } from "react";
import { revalidatePath } from "next/cache";
import CollectionBar from "@/components/CollectionBar";
import DeleteCollection from "@/components/DeleteCollection";
import CardCollections from "@/components/CardCollections";
import RenameCollection from "@/components/RenameCollection";

export type GameObject = {
  gameId: number;
  gameImg: string;
  gameName: string;
  platforms: string[];
  gameRelease: string;
  gameDescription: string;
  rating: number;
}[];

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Video Game Hoard | Collections",
  description: "collectionid",
};

async function SingleCollection({
  params: { collectionid },
}: {
  params: {
    collectionid: string;
  };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  //collections by name
  const { data: games } = await supabase
    .from("games")
    .select()
    .eq("user_id", user.id)
    .eq("collection", decodeURIComponent(collectionid.replace(/%20/g, " ")));

  //collecitons by status
  const { data: gamesByStatus } = await supabase
    .from("games")
    .select()
    .eq("user_id", user.id)
    .eq("status", collectionid.replace(/%20/g, " "));

  //all games
  const { data: allGames } = await supabase
    .from("games")
    .select()
    .eq("user_id", user.id);

  if (!games) {
    return;
  }
  if (!gamesByStatus) {
    return;
  }
  if (!allGames) {
    return;
  }

  const hardCodedCollection = collectionid === "all" ? "games" : "";

  //game by user created collection FILTER EMPTY OBJ
  const gamesInCollection = games.map((games) => games.game_info);

  const filteredObject = gamesInCollection.filter((obj) =>
    Object.values(obj).some((value) => value !== "" && value !== null)
  );

  //all games FILTER EMPTY OBJ
  const allGamesCollection = allGames.map((games) => games.game_info);

  const filteredAllGamesClean = allGamesCollection.filter((obj) =>
    Object.values(obj).some((value) => value !== "" && value !== null)
  );

  // console.log(
  //   "id array of filetered",
  //   filteredAllGamesClean.map((game) => game.gameId)
  // );

  //set new array to remove duplicates
  const filteredAllGames: GameObject = [...new Set(filteredAllGamesClean)];

  //games by status FILTER EMPTY OBJ
  const statusGames = gamesByStatus.map((games) => games.game_info);

  const filteredStatusGames = statusGames.filter((obj) =>
    Object.values(obj).some((value) => value !== "" && value !== null)
  );

  //filter all collections
  const array: string[] = allGames.map((games) => games.collection);
  //remove null and empty
  const filteredCollectionArray = array.filter((obj) =>
    Object.values(obj).some((value) => value !== "" && value !== null)
  );

  //set a new array to eliminate duplicates
  const filteredArray: string[] = [
    ...new Set(
      filteredCollectionArray.sort((a, b) => a[0].localeCompare(b[0]))
    ),
  ];

  async function createCollectionHandler(formData: FormData) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const nameCollection = formData.get("name");
    const nameCollectrionTrim = nameCollection
      ?.toString()
      .trim()
      .replace(/\s+/g, " ");

    if (!user) {
      return;
    }

    // if (!nameCollectrionTrim) {
    //   return;
    // }

    try {
      const { data: newCollection } = await supabase.from("games").insert([
        {
          collection: nameCollectrionTrim,
          user_id: user.id,
        },
      ]);
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

    revalidatePath("/collections");
  }

  //delete collection handler
  async function deleteCollectionHandler(collectionid: string) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
      //this one deletes the collection empty line
      const { data: deleteCollection, error } = await supabase
        .from("games")
        .delete()
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", "")
        .eq("collection", collectionid)
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
    ///// this one clear the collection from the game line

    try {
      const { data: clearCollection, error } = await supabase
        .from("games")
        .update({ collection: "" })
        .eq("user_id", user?.id)
        .eq("collection", decodeURIComponent(collectionid))
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

    redirect("/collections/all");
  }

  //rename collection handler
  async function renameCollectionHandler(formData: FormData) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const nameCollection = formData.get("collectionRename");
    const nameCollectrionTrim = nameCollection
      ?.toString()
      .trim()
      .replace(/\s+/g, " ");

    if (!nameCollectrionTrim) {
      return;
    }

    if (!user) {
      return;
    }

    try {
      const { data: renameCollection, error } = await supabase
        .from("games")
        .update({ collection: nameCollectrionTrim })
        .eq("user_id", user?.id)
        .eq("collection", decodeURIComponent(collectionid))
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

    redirect(`/collections/${encodeURIComponent(nameCollectrionTrim)}`);
  }

  //finished handler
  async function finishedHandler(gameName: string) {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (!user) {
      return;
    }

    try {
      const { data: finished, error } = await supabase
        .from("games")
        .update({ status: "completed" })
        .eq("user_id", user?.id)
        .eq("game_info ->> gameName", gameName)
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

    revalidatePath("/collections/[collectionid]", "page");
  }

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.sideBarContainer}>
          <CollectionBar
            collectionid={collectionid}
            filteredArray={filteredArray}
            createCollectionHandler={createCollectionHandler}
          />
        </div>

        <div className={classes.collectionContainer}>
          <div className={classes.titles}>
            <h1>
              {`${
                decodeURIComponent(collectionid).charAt(0).toUpperCase() +
                decodeURIComponent(collectionid).slice(1)
              } 
             ${hardCodedCollection}
            `}
            </h1>
          </div>
          <div className={classes.titles}>
            <h2>
              {/*custom collection counter*/}
              {(collectionid === "all" ||
              collectionid === "completed" ||
              collectionid === "want%20to%20play" ||
              collectionid === "currently%20playing"
                ? false
                : true) &&
                (filteredObject.length === 0 || filteredObject.length >= 2
                  ? `${filteredObject.length} Games in Collection`
                  : `${filteredObject.length} Game in Collection`)}

              {/*completed or currently playing counter*/}
              {collectionid === "completed" ||
              collectionid === "want%20to%20play" ||
              collectionid === "currently%20playing"
                ? filteredStatusGames.length === 0 ||
                  filteredStatusGames.length >= 2
                  ? `${filteredStatusGames.length} Games in Collection`
                  : `${filteredStatusGames.length} Game in Collection`
                : ""}

              {/*all games counter*/}
              {collectionid === "all"
                ? filteredAllGames.length === 0 || filteredAllGames.length >= 2
                  ? `${filteredAllGames.length} Games in Collection`
                  : `${filteredAllGames.length} Game in Collection`
                : ""}
            </h2>
          </div>
          <div className={classes.gamesContainer}>
            <div className={classes.games}>
              {filteredObject.map((games) => (
                <div key={games.gameId}>
                  <CardCollections
                    collectionid={collectionid}
                    gameId={games.gameId}
                    gameName={games.gameName}
                    finishedHandler={finishedHandler}
                  >
                    {""}
                  </CardCollections>
                </div>
              ))}

              {collectionid === "all"
                ? filteredAllGames.map((games) => (
                    <div key={games.gameId}>
                      <CardCollections
                        collectionid={collectionid}
                        gameId={games.gameId}
                        gameName={games.gameName}
                        finishedHandler={finishedHandler}
                      >
                        {""}
                      </CardCollections>
                    </div>
                  ))
                : ""}

              {collectionid === "completed" ||
              collectionid === "want%20to%20play" ||
              collectionid === "currently%20playing"
                ? filteredStatusGames.map((games) => (
                    <div key={games.gameId}>
                      <div></div>
                      <CardCollections
                        collectionid={collectionid}
                        gameId={games.gameId}
                        gameName={games.gameName}
                        finishedHandler={finishedHandler}
                      >
                        {""}
                      </CardCollections>
                    </div>
                  ))
                : ""}
            </div>
          </div>
          <div className={classes.deleteCollection}>
            {(collectionid === "all" ||
            collectionid === "completed" ||
            collectionid === "want%20to%20play" ||
            collectionid === "currently%20playing"
              ? false
              : true) && (
              <>
                <DeleteCollection
                  collectionid={collectionid}
                  deleteCollectionHandler={deleteCollectionHandler}
                />
                <RenameCollection
                  renameCollectionHandler={renameCollectionHandler}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default SingleCollection;
