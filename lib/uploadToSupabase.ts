import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

// Convert image URI to binary buffer
async function uriToArrayBuffer(uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return decode(base64);
}

export async function uploadImageToSupabase(uri: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const userId = user.id;

    const fileExt = uri.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt ?? "jpg"}`;
    const filePath = `uploads/${fileName}`;
    const fileBuffer = await uriToArrayBuffer(uri);

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filePath, fileBuffer, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 🔐 Get a signed URL (valid for 7 days = 60 * 60 * 24 * 7 seconds)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("uploads")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    if (signedError) throw signedError;

    return signedData.signedUrl;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
}