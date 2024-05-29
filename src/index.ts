import {
  createConversationsArray,
  getUserMessages,
  readFile,
  saveData,
  submitConversationsArray,
  testFile,
} from "./utils"

const run = async () => {
  const DATA_PATH = "src/data"
  const isDataSaved = await testFile(DATA_PATH)

  let data

  // cache the data to avoid unnecessary API calls during development
  if (!isDataSaved) {
    console.log("Data not saved, fetching from API")
    data = await getUserMessages()
    await saveData(DATA_PATH, data)
  }

  data = await readFile(DATA_PATH)

  const conversations = createConversationsArray(data)

  await submitConversationsArray({ conversations })
}

run()
