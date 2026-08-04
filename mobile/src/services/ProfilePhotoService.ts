import {
  Directory,
  File,
  Paths,
} from "expo-file-system";
const profilePhotoDirectory =
  new Directory(
    Paths.document,
    "niva",
    "profile"
  );
function ensureDirectory(): void {
  profilePhotoDirectory.create({
    idempotent: true,
    intermediates: true,
  });
}
function extensionFromUri(
  uri: string
): string {
  const cleanUri =
    uri.split("?")[0];
  const match =
    /\.[a-zA-Z0-9]+$/.exec(
      cleanUri
    );
  return match?.[0] ?? ".jpg";
}
export function saveProfilePhoto(
  sourceUri: string
): string {
  ensureDirectory();
  const source =
    new File(sourceUri);
  const destination =
    new File(
      profilePhotoDirectory,
      `baby-profile-${Date.now()}${extensionFromUri(
        sourceUri
      )}`
    );
  source.copy(destination);
  return destination.uri;
}
export function deleteProfilePhoto(
  uri?: string
): void {
  if (!uri) {
    return;
  }
  try {
    const file =
      new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch (error) {
    console.warn(
      "Unable to delete profile photo:",
      error
    );
  }
}