export const convertPicture=(arrayBuffer)=>{
  const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    );
  return `data:image/jpeg;base64,${base64}`;
}

// export const convertPicture=(arrayBuffer)=>{
//     const base64 = btoa(
//         new Uint8Array(arrayBuffer).reduce(
//           (data, byte) => data + String.fromCharCode(byte),
//           '',
//         ),
//       );
//     return `data:image/jpeg;base64,${base64}`;
// }