import { resizeImage } from "@/lib/image";

// Envoie une image dans le bucket Supabase « project-images » et renvoie son URL publique.
// kind = "logo" : PNG transparent 600 px max ; sinon photo JPEG 1400 px max.
export async function uploadImage(sb, file, folder, kind = "photo") {
  const logo = kind === "logo";
  const blob = await resizeImage(file, logo ? { maxDim: 600, type: "image/png" } : {});
  const contentType = logo ? "image/png" : "image/jpeg";
  const path = `${folder}/${Date.now()}.${logo ? "png" : "jpg"}`;
  const up = await sb.storage.from("project-images").upload(path, blob, { contentType, cacheControl: "31536000" });
  if (up.error) throw up.error;
  return sb.storage.from("project-images").getPublicUrl(path).data.publicUrl;
}
