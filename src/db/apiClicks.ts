// src/db/apiClicks.ts
import supabase from "./supabase";

export interface Click {
  url_id: string;
  count: number;
  // Add other properties as needed
}

export async function getClickForUrl(urlIds: string[]): Promise<Click[]> {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load clicks");
  }
  return data;
}