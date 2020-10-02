<template>
  <div>
  </div>
</template>
<script>
/*
|---------------------------------------------------------------------
| Logout Page Component
|---------------------------------------------------------------------
|
| Sign out template for user authentication into the application
|
*/
import { mapActions } from 'vuex'

export default {
  mounted() {
    this.singOut()
  },
  methods: {
    ...mapActions({
      logout: 'auth/signOut'
    }),
    async singOut() {
      await this.logout().then(() => {
        this.$router.push({ name: 'auth-signin' })
      })
    }
  }
}
</script>
