import fs from "fs/promises"
const GET_URL =
  `https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=${process.env.API_TOKEN}`
const POST_URL =
  `https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=${process.env.API_TOKEN}`

/* HELPER FUNCTIONS */
export const saveData = async (path: string, data: {}) => {
  await fs.writeFile(`${path}/data.json`, JSON.stringify(data))
}

export const testFile = async (path: string) => {
  try {
    await fs.access(`${path}/data.json`)
    return true
  } catch (error) {
    return false
  }
}

export const readFile = async (path: string) => {
  const data = await fs.readFile(`${path}/data.json`, "utf-8")
  return JSON.parse(data)
}

/* PRIMARY FUNCTIONS */
export const getUserMessages = async () => {
  const res = await fetch(GET_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return res.json()
}

export const submitHubSpotData = async (data: {}) => {
  const res = await fetch(POST_URL, {
    method: "POST",
    body: JSON.stringify(data),
  })
  if (res.status === 200) {
    console.log("Data submitted successfully, you did it :D")
  }
  return res.json()
}

export const formatHubSpotData = (data: {}) => {}

export const testFetch = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  return res.json()
}
