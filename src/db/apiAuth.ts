
import supabase from "./supabase";
import supabaseUrl from './supabase'

interface AuthParams {
    email: string;
    password: string;
  }
  
  interface SignupParams extends AuthParams {
    name: string;
    profile_pic: File | null;
  }
  

export async function getCurrentUser(){
    const { data: session, error } = await supabase.auth.getSession()

    if(!session){
        return null
    }
    if(error){
        throw Error(error.message)
    }

    return session.session?.user
}

  // Login function 
  export async function login({ email, password }: AuthParams) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  }
  

  export async function signup({ name, email, password, profile_pic }: SignupParams) {
    if (!profile_pic) {
      throw new Error("Profile picture is required.");
    }
  
    const fileName = `db-${name.split(" ").join("-")}-${Math.random()}`;
  
    const { error: storageError } = await supabase.storage
      .from("profile_pic")
      .upload(fileName, profile_pic as File); 
  
    if (storageError) throw new Error(storageError.message);
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
        },
      },
    });
  
    if (error) throw new Error(error.message);
  
    return data;
  }
  


  export async function Logout(){
    const { error } = await supabase.auth.signOut()

    if (error) throw new Error(error.message);
  
  }