export default function (chat) {
  const { chatRequest } = chat

  return chatRequest ? chat.client.email : chat.channelName
}