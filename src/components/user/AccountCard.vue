<template>
  <v-card>
    <v-card-title>{{ $t('b2tickets.tabs.user.account.title') }}</v-card-title>
    <div class="d-flex flex-column flex-sm-row">
      <div class="d-flex flex-column justify-center align-center mx-3">

        <UserAvatar :user="user" :size="80" />

        <v-btn
          v-if="checkUserRole(user, 'operator')"
          class="mt-1"
          small
          max-width="100"
          @click="dialog.avatar = true"
        >{{ $t('b2tickets.user.pages.editUser.editAvatar') }}
        </v-btn>
        <!-- avatar modal -->
        <v-dialog v-model="dialog.avatar" max-width="500">
          <v-card>
            <v-card-title class="headline">{{ $t('b2tickets.user.pages.editUser.avatar') }}</v-card-title>
            <v-item-group>
              <v-row no-gutters>
                <v-col v-for="(item, inx) in items" :key="inx" cols="3">
                  <v-item v-slot="{ toggle }">
                    <v-img
                      :src="item"
                      height="130"
                      class="text-right pa-4"
                      @click="toggle"
                    >
                    </v-img>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="dialog.avatar = false">{{ $t('common.cancel') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-card-text class="flex-grow-1 pt-2 pa-sm-2">
        <v-text-field
          v-model="user.name"
          :label=" $t('b2tickets.user.fields.name') "
          placeholder="Name"
          :readonly="active"
        ></v-text-field>
        <v-text-field
          v-model="user.email"
          :label=" $t('b2tickets.user.fields.email') "
          hide-details
          :readonly="active"
        ></v-text-field>
      </v-card-text>
    </div>
    <v-card-actions v-if="checkUserRole(user, 'operator')" class="justify-end">
      <v-btn color="success" @click>{{ $t('common.save') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import UserAvatar from '@/apps/chat/components/UserAvatar'

export default {
  components: {
    UserAvatar
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatarPicker: false,
      disableDialog: false,
      dialog: {
        avatar: false
      },
      isLoading: false,
      items: []
    }
  },
  created() {
    this.getAvatars()
  },
  methods: {
    checkUserRole(user, role) {
      const { userRoles } = user

      return userRoles ? user.userRoles.some((r) => r.name === role) : false
    },
    getAvatars(counter = 1) {
      const image = this.getImgUrl(counter)

      if (image) {
        this.items.push(this.getImgUrl(counter))

        this.getAvatars(this.items.length + 1)
      }
    },
    getImgUrl(id) {
      try {
        const images = require.context('@/assets/images/avatars', false, /\.svg$/)

        return images('./avatar' + id + '.svg')
      } catch {
        return undefined
      }
    }
  }
}
</script>
