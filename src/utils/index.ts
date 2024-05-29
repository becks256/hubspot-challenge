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

/*  create a list of conversations that your user has had with other users. 
A conversation is defined by the other user you are sharing messages with, 
the total number of messages sent between the two of you and the most recent 
message which has been sent.
We also expect the conversations to be ordered so that the conversations with 
the most recent messages appear first.
*/
/* example input:
{
  "messages": [
      {
          "content": "The quick brown fox jumps over the lazy dog",
          "fromUserId": 50210,
          "timestamp": 1529338342000,
          "toUserId": 67452
      },
      {
          "content": "Pangrams originate in the discotheque",
          "fromUserId": 67452,
          "timestamp": 1529075415000,
          "toUserId": 50210
      },
      {
          "content": "Have you planned your holidays this year yet?",
          "fromUserId": 67452,
          "timestamp": 1529542953000,
          "toUserId": 50210
      },
      {
          "content": "Strange noises have been heard on the moors",
          "fromUserId": 78596,
          "timestamp": 1533112961000,
          "toUserId": 50210
      },
      {
          "content": "You go straight ahead for two hundred yards and then take the first right turn",
          "fromUserId": 50210,
          "timestamp": 1533197225000,
          "toUserId": 78596
      },
      {
          "content": "It's a privilege and an honour to have known you",
          "fromUserId": 78596,
          "timestamp": 1533118270000,
          "toUserId": 50210
      }
  ],
  "userId": 50210,
  "users": [
      {
          "avatar": "octocat.jpg",
          "firstName": "John",
          "lastName": "Doe",
          "id": 67452
      },
      {
          "avatar": "genie.png",
          "firstName": "Michael",
          "lastName": "Crowley",
          "id": 78596
      }
  ]
}
*/
/* example output:
{
  "conversations": [
      {
          "avatar": "genie.png",
          "firstName": "Michael",
          "lastName": "Crowley",
          "mostRecentMessage": {
              "content": "You go straight ahead for two hundred yards and then take the first right turn",
              "timestamp": 1533197225000,
              "userId": 50210
          },
          "totalMessages": 3,
          "userId": 78596
      },
      {
          "avatar": "octocat.jpg",
          "firstName": "John",
          "lastName": "Doe",
          "mostRecentMessage": {
              "content": "Have you planned your holidays this year yet?",
              "timestamp": 1529542953000,
              "userId": 67452
          },
          "totalMessages": 3,
          "userId": 67452
    }
  ]
}
*/

export const createConversationsArray = (data: Dataset) => {
  const { messages, userId, users } = data

  const userMessages = mapUsersToMessages(messages, users, userId)
  const conversationsArray = consolidateConversations(userMessages)
  const sortedConversationsArray = conversationsArray.sort(
    (a, b) => b.mostRecentMessage.timestamp - a.mostRecentMessage.timestamp
  )

  return sortedConversationsArray
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
