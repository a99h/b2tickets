<script>
import ChatsTable from '../components/ChatsTable'
import { showChatRequest } from '../http/chatRequest'

export default {
  components: { ChatsTable },
  watch: {
    '$route.params.id'() {
      this.startChannel(this.$route.params.id)
    },
    'chat.unreadMessagesCount'() {
      this.chat.unreadMessagesCount = 0
    }
  },
  methods: {
    addChannel(chatRequest) {


      this.$emit('addChat', chatRequest)
    }
  }
}
</script>
