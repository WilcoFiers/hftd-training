import { serverTimestamp } from "@/firebase";

export function prepareFirestoreData(dataIn: { [propName: string]: any }) {
  const dataOut: { [propName: string]: any } = {}
  Object.entries(dataIn).forEach(([key, value]) => {
    if (value === Date) {
      dataOut[key] = serverTimestamp()
    } else {
      dataOut[key] = value
    }
  })
  return dataOut
}