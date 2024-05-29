import fs from "fs/promises"
import {
  Conversation,
  Dataset,
  Message,
  MessageWithUser,
  User,
  UserMap,
} from "../../index"

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

export const mapUsersToMessages = (
  messages: Message[],
  users: User[],
  currentUser: number
) => {
  const userMap: UserMap = {}
  users.forEach(({ id, ...rest }) => {
    userMap[id] = { id, ...rest }
  })

  return messages.map((message) => {
    const user =
      message.toUserId === currentUser
        ? userMap[message.fromUserId]
        : userMap[message.toUserId]
    return {
      ...message,
      user,
    }
  })
}

/* example message:
  {
    fromUserId: 307620,
    toUserId: 253496,
    timestamp: 1533505429000,
    content: 'Sometimes it is better to just walk away from things and go back to them later when you’re in a better frame of mind.',
    user: {
      firstName: 'Antonio',
      lastName: 'Mackimmie',
      avatar: 'control.png'
    }
  }
*/

export const consolidateConversations = (messages: MessageWithUser[]) => {
  // each conversation should be an object with the following properties:
  // avatar, firstName, lastName, mostRecentMessage, totalMessages, userId
  // avatar, firstName, lastName, id are all from the user object
  // mostRecentMessage should contain content, timestamp, and userId of the last message sender

  const conversations: Conversation[] = []
  messages.map((message) => {
    const { user, content, timestamp, fromUserId } = message
    const { avatar, firstName, lastName, id: userId } = user

    const convoIndex = conversations.findIndex((item) => item.userId === userId)

    if (convoIndex < 0) {
      conversations.push({
        avatar,
        firstName,
        lastName,
        mostRecentMessage: {
          content,
          timestamp,
          userId: fromUserId,
        },
        totalMessages: 1,
        userId,
      })
      return
    }

    const convo = conversations[convoIndex]
    convo.totalMessages += 1
    if (timestamp > convo.mostRecentMessage.timestamp) {
      convo.mostRecentMessage = {
        content,
        timestamp,
        userId: fromUserId,
      }
    }
  })

  return conversations
}
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
