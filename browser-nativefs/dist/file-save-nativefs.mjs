// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
export default async(e,t={},a=null)=>{try{t.fileName=t.fileName||"Untitled",a=a||await window.chooseFileSystemEntries({type:"saveFile",accepts:[{description:t.description||"",mimeTypes:[e.type]}]});const i=await a.createWriter();await i.truncate(0),await i.write(0,e),await i.close()}catch(e){throw e}};