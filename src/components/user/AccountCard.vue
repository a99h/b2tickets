<template>
  <v-sheet class="px-3 py-3 surface">

    <v-card>
      <v-card-title>{{ $t('b2tickets.user.pages.editUser.info') }}</v-card-title>
      <div class="d-flex flex-column flex-sm-row">
        <v-col>
          <v-img
            :src="user.userSettings.avatar"
            aspect-ratio="1"
            class="blue-grey lighten-4 rounded elevation-3"
            max-width="100"
            max-height="100"
          ></v-img>
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
        </v-col>
        <v-card-text class="flex-grow-1 pt-2 pa-sm-2">
          <v-text-field
            v-model="user.name"
            :label=" $t('b2tickets.user.fields.name') "
            placeholder="Name"
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :label=" $t('b2tickets.user.fields.email') "
            hide-details
          ></v-text-field>
        </v-card-text>
      </div>
      <v-card-actions class="justify-end">
        <v-btn color="success" @click>{{ $t('common.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
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
