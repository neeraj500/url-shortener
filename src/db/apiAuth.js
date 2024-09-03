import supabase, {supabaseUrl} from "./supabase";

// All logic for login and signup

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function signup({ name, email, password, profile_pic }) { 
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
    
    const {error: storageError} = await supabase.storage
        .from("profile_pic")
        .upload(fileName, profile_pic);

        if (storageError) throw new Error(storageError.message);

        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    profile_pic: `${supabaseUrl}/storage/v1/object/public/profile/${fileName}`,
                }
            }
        });

        if (error) throw new Error(error.message);

        return data;
  }

  export async function getCurrentUser() {
    // from local storage
    const { data: session, error } = await supabase.auth.getSession();
    if (!session.session) return null;
    
    // if we want we can retreive from db
    //cosnt {data, session} = await supabase.auth.getUser();
  
    if (error) throw new Error(error.message);
  
    return session.session?.user;
  }

  export async function logout() {
    const {error} = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }