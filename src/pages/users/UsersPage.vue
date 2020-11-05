<template>
  <div class="flex-grow-1">
    <users-table></users-table>
  </div>
</template>

<script>
import UsersTable from './components/UsersTable'
export default {
  name: 'UsersPage',
  components: { UsersTable }
}
</script>
