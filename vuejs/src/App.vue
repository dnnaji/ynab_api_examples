<template>
  <v-app>
    <core-drawer />
    <div id="app">
      <v-app id="inspire">
        <v-toolbar color="indigo" dark fixed app>
          <v-toolbar-title>YNAB API + Vuetify</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn outline>Test</v-btn>
          <v-btn outline>text</v-btn>
        </v-toolbar>
        <v-content>
          <v-container fluid fill-height>
            <v-layout>Testing</v-layout>
          </v-container>
        </v-content>
        <v-footer color="indigo" app inset>
          <span class="white--text">&copy; 2019</span>
        </v-footer>
      </v-app>
    </div>
  </v-app>
</template>

<script>
import { budgetStore } from '@/lib/BudgetStore'

export default {
  name: 'App',
  components: {},
  data() {
    return {
      test: budgetStore.budget.name
    }
  },
  computed: {
    name() {
      return budgetStore.budget.name
    },
    categories() {
      return budgetStore.budget.categories
    }
  },
  methods: {}
}
</script>
