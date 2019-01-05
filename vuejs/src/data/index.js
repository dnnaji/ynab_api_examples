//import budgets from "@/data/budgets.json";
// import categories from "@/data/categories.json";
//const cfg = require("@/data/.json");
const budgetsJson = require('./budgets.json')
// const categoriesJson = require("./categories.json");

// "name": "Household Expenses",

export default {
  budget: budgetsJson.data.budgets[0],
  fixedCategoryGroup: {
    id: '',
    name: 'Household Expenses'
  }

  // budgetCatagories: ,
}
