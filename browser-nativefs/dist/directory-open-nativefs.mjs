// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
const t=async(e,i,r=[])=>{for await(const a of e)a.isFile?r.push(await a.getFile()):a.isDirectory&&i&&await t(await a.getEntries(),i,r);return r};export default async(e={})=>{e.recursive=e.recursive||!1,e.multiple=e.multiple||!1;try{const i=await window.chooseFileSystemEntries({type:"openDirectory",multiple:e.multiple}),r=await i.getEntries();return await t(r,e.recursive)}catch(t){throw t}};