const {
  createConversationsArray,
  consolidateConversations,
  mapUsersToMessages,
} = require("./index")

const sampleInput = {
  messages: [
    {
      content: "The quick brown fox jumps over the lazy dog",
      fromUserId: 50210,
      timestamp: 1529338342000,
      toUserId: 67452,
    },
    {
      content: "Pangrams originate in the discotheque",
      fromUserId: 67452,
      timestamp: 1529075415000,
      toUserId: 50210,
    },
  ],
  userId: 50210,
  users: [
    {
      avatar: "octocat.jpg",
      firstName: "John",
      lastName: "Doe",
      id: 67452,
    },
    {
      avatar: "genie.png",
      firstName: "Michael",
      lastName: "Crowley",
      id: 78596,
    },
  ],
}

describe("mapUsersToMessages", () => {
  it("should return an array of messages with user data", () => {
    const { messages: messagesInSet, users, userId } = sampleInput
    const messages = mapUsersToMessages(messagesInSet, users, userId)
    expect(messages).toEqual([
      {
        content: "The quick brown fox jumps over the lazy dog",
        fromUserId: 50210,
        timestamp: 1529338342000,
        toUserId: 67452,
        user: {
          avatar: "octocat.jpg",
          firstName: "John",
          lastName: "Doe",
          id: 67452,
        },
      },
      {
        content: "Pangrams originate in the discotheque",
        fromUserId: 67452,
        timestamp: 1529075415000,
        toUserId: 50210,
        user: {
          avatar: "octocat.jpg",
          firstName: "John",
          lastName: "Doe",
          id: 67452,
        },
      },
    ])
  })
})

describe("consolidateConversations", () => {
  it("should return an object of conversations", () => {
    const mappedInput = [
      {
        content: "The quick brown fox jumps over the lazy dog",
        fromUserId: 50210,
        timestamp: 1529338342000,
        toUserId: 67452,
        user: {
          avatar: "octocat.jpg",
          firstName: "John",
          lastName: "Doe",
          id: 67452,
        },
      },
      {
        content: "Pangrams originate in the discotheque",
        fromUserId: 67452,
        timestamp: 1529075415000,
        toUserId: 50210,
        user: {
          avatar: "octocat.jpg",
          firstName: "John",
          lastName: "Doe",
          id: 67452,
        },
      },
    ]
    const conversations = consolidateConversations(mappedInput)
    expect(conversations).toEqual([
      {
        avatar: "octocat.jpg",
        firstName: "John",
        lastName: "Doe",
        mostRecentMessage: {
          content: "The quick brown fox jumps over the lazy dog",
          timestamp: 1529338342000,
          userId: 50210,
        },
        totalMessages: 2,
        userId: 67452,
      },
    ])
  })
})

describe("createConversationsArray", () => {
  it("should return an array of conversations", () => {
    const conversations = createConversationsArray(sampleInput)
    expect(conversations).toEqual([
      {
        avatar: "octocat.jpg",
        firstName: "John",
        lastName: "Doe",
        mostRecentMessage: {
          content: "The quick brown fox jumps over the lazy dog",
          timestamp: 1529338342000,
          userId: 50210,
        },
        totalMessages: 2,
        userId: 67452,
      },
    ])
  })
})
