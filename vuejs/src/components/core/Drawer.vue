<template>
  <v-navigation-drawer app permanent width="400">
    <v-list>
      <v-subheader class>Budget Activity ({{ totalActivity }})</v-subheader>
      <v-divider></v-divider>
      <v-list v-for="item in items" :key="item.id">
        <v-list-tile @click>
          <v-list-tile-content>{{ item.name }}</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <v-chip color="red" text-color="white">{{
              item.activity | currency
            }}</v-chip>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-list>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
import { budgetStore } from '@/lib/BudgetStore'

export default {
  data: () => ({}),
  computed: {
    items() {
      return budgetStore.budget.categories
    },
    totalActivity() {
      return 1 * budgetStore.budget.totalActivity
    }
  }
}
</script>

<style></style>
