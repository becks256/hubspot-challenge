export type Message = {
  content: string
  fromUserId: number
  timestamp: number
  toUserId: number
}

export type User = {
  avatar: string
  firstName: string
  lastName: string
  id: number
}

export type UserMap = {
  [key: number]: user
}

export type Conversation = {
  avatar: string
  firstName: string
  lastName: string
  mostRecentMessage: {
    content: string
    timestamp: number
    userId: number
  }
  totalMessages: number
  userId: number
}

export type MessageWithUser = {
  content: string
  fromUserId: number
  timestamp: number
  toUserId: number
  user: User
}

export type Dataset = {
  messages: Message[]
  users: User[]
  userId: number
}
