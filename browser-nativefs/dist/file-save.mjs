// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
const e="chooseFileSystemEntries"in self?import("./file-save-nativefs.mjs"):import("./file-save-legacy.mjs");export async function fileSave(...i){return(await e).default(...i)}