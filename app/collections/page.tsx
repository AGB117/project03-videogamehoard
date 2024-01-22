import { redirect } from "next/navigation";

async function Collections() {
  redirect("/collections/all");
}

export default Collections;
