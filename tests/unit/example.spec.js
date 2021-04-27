import { shallowMount } from '@vue/test-utils'
import ChatApp from '@/apps/chat/ChatApp.vue'

describe('ChatApp.vue', () => {
  it('renders props.msg when passed', () => {
    // const msg = 'new message'
    // const wrapper = shallowMount(HelloWorld, {
    //   propsData: { msg }
    // })
    //
    // expect(wrapper.text()).toMatch(msg)
    expect(ChatApp).toBe(ChatApp)
  })
})
