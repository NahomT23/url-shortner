// src/db/apiUrls.ts
import { ReactNode } from "react";
import supabase from "./supabase";
import { SupabaseClient } from '@supabase/supabase-js';


export interface Url {
  created_at: string | number | Date;
  orignal_url: ReactNode;
  short_url: ReactNode;
  custom_url: any;
  qr: string | undefined;
  id: string;
  title: string;
  user_id: string;
}


export async function getUrl(user_id: string): Promise<Url[]> {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load URLs");
  }
  return data;
}

export async function deleteUrl(id: string | any) {
  const { error } = await supabase
    .from("urls")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete URL");
  }
}





type CreateUrlParams = {
  title: string;
  longUrl: string;
  custom_url?: string | null;
  user_id: string;
};

type UrlData = {
  id: any;
  title: string;
  original_url: string;
  custom_url: string | null;
  user_id: string;
  short_url: string;
  qr: string;
};

export async function createUrl(
  supabase: SupabaseClient,
  supabaseUrl: string,
  params: CreateUrlParams,
  qrcode: Blob // Assuming qrcode is a Blob or File object
): Promise<UrlData[]> {
  const { title, longUrl, custom_url, user_id } = params;

  // Generate a random short URL
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${short_url}`;

  // Upload the QR code to Supabase storage
  const { error: storageError } = await supabase.storage
    .from('qrs')
    .upload(fileName, qrcode);

  if (storageError) {
    throw new Error(storageError.message);
  }

  // Construct the public URL for the uploaded QR code
  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  // Insert the URL data into the 'urls' table
  const { data, error } = await supabase
    .from('urls')
    .insert([
      {
        title,
        original_url: longUrl,
        custom_url: custom_url || null,
        user_id,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error.message);
    throw new Error('Error creating short URL');
  }

  return data as UrlData[];
}