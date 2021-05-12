import isEmpty from '@/js/lib/isEmpty'

export default function (chat) {
  if (isEmpty(chat)) return

  const { chatRequest } = chat

  return chatRequest ? chat.client.show().email : chat.channelName
}