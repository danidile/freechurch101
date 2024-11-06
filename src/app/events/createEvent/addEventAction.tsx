// "use server";
// import { encodedRedirect } from "@/utils/utils";
// import { createClient } from "@/utils/supabase/server";
// import { TeventSchema } from "@/utils/types/types";


// export const addEvent = async (formData: TeventSchema) => {

    
//     const supabase = createClient();
//     console.log(formData);  
    
//     const { error } = await supabase
//     .from('events')
//     .insert({ title: formData.eventTitle,
//       })
//     .select()
        
    
//     if (error) {
//       console.error(error.code + " " + error.message);
//       return encodedRedirect("error", "/sign-up", error.message);
//     } else {
//       return encodedRedirect(
//         "success",
//         "/events",
//         "Thanks for signing up! Please check your email for a verification link.",
//       );
//     }
//   };


 