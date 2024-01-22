import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
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
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
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
        },
      },
    }
  );
};
