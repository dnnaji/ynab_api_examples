import Vue from 'vue'
import cfg from '@/data'
import YNABService from './YNABService'

const budgetStore = new Vue({
  data: {
    // data objeects in the store
    budget: {
      name: null,
      categories: []
    }
  },
  created() {
    this.loadYnabBudget(cfg.budget.id)
  },
  methods: {
    // Logic to mutate state
    async loadYnabBudget(id) {
      try {
        const response = await YNABService.budgets(id)
        this.populateBudgetStore(response)
      } catch (error) {
        console.error(error)
      }
    },
    populateBudgetStore(response) {
      const { categories } = response

      const obj = {
        //name: name,
        categories: categories.filter(function(category) {
          return category.category_group_id === cfg.fixedCategoryGroup.id
        }),
        totalActivity: categories.reduce((total, category) => {
          return total + Number(category.activity)
        })
      }

      // this.budget.categories
      this.budget = Object.assign(cfg.fixedCategoryGroup, obj)
    }
  }
})

export { budgetStore }
