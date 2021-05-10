export default function (chat) {
  const { messages } = chat

  return messages[messages.length - 1] ? messages[messages.length - 1].user.email + ': ' + messages[messages.length - 1].text : ''
}