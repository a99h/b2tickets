import ChatRequest from '@/apps/chat/models/ChatRequest'

test('new works', () => {
  expect(new ChatRequest).toBeInstanceOf(ChatRequest)
})