const fetch = require("node-fetch");

var http = require("http");
var auth = require("basic-auth");
var compare = require("tsscmp");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

module.exports = async (req, res) => {
  var credentials = auth(req);

  // Check credentials
  // The "check" function will typically be against your user store
  if (
    (!credentials || !check(credentials.name, credentials.pass)) &&
    process.env.NODE_ENV == "production"
  ) {
    res.statusCode = 401;
    res.setHeader(
      "WWW-Authenticate",
      'Basic realm="API Authentication Required"'
    );
    res.end("Access denied");
  }

  const fetchOpts = {
    headers: {
      Authorization: "Bearer " + process.env.YNAB_API_TOKEN,
      "Content-Type": "application/json"
    }
  };

  const response = await fetch(
    "https://api.youneedabudget.com/v1/budgets/!!!-- REPLACE WITH BUDGET ID --!!!",
    fetchOpts
  );

  const json = await response.json();

  if (process.env.NODE_ENV == "production") {
    let responseJSON = budgetTransactionsJSON(json);
    responseJSON = JSON.stringify(responseJSON);

    res.setHeader("Content-Type", "application/json");
    res.end(responseJSON);
  }

  // Assume using micro
  return budgetTransactionsJSON(json);
};

function budgetTransactionsJSON(json) {
  const budget = json.data.budget;
  const types = {
    account: "accounts",
    payee: "payees",
    category: "categories"
  };
  const getObjectMap = (type, array) => {
    let value = {};
    for (let i = 0; i < array.length; i++) {
      let record = array[i];
      value[record.id] = record.name;
    }

    return value;
  };

  // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
  // Making use of spread operator and computed key name syntax:
  // Since ES7 / ES2016 you can use Object.entries instead of Object.keys e.g. like this:
  const objectMap = Object.assign(
    ...Object.entries(types).map(([k, v]) => ({
      [k]: getObjectMap(k, budget[v])
    }))
  );

  const getFilteredTransactionsbyCategoryGroup = categoryGroupID => {
    // Filter out only active categoryes based on categoryGroupID
    let filterCategories = budget.categories
      .filter(
        c => c.category_group_id === categoryGroupID && c.deleted !== true
      )
      .map(category => category.id);

    //console.log(filterCategories);
    return budget.transactions.filter(t => {
      return filterCategories.indexOf(t.category_id) !== -1;
    });
  };
  // Spearcial formating to convert YNAB API amount to decimal value
  const formatYNABAmount = num => Number((num / 1000).toFixed(2));

  const getBudgetTransaction = object => {
    return {
      id: object.id,
      date: object.date,
      amount: formatYNABAmount(object.amount),
      memo: object.memo !== null ? object.memo : "",
      cleared: object.cleared === true ? "Yes" : "No",
      approved: object.approved === true ? "Yes" : "No",
      account: objectMap["account"][object.account_id],
      payee: objectMap["payee"][object.payee_id],
      category: objectMap["category"][object.category_id]
    };
  };

  return getFilteredTransactionsbyCategoryGroup(
    "XX YY ZZ" // Category Group Filtering by ID
  ).map(t => getBudgetTransaction(t));
}

// Basic function to validate credentials for example
function check(name, pass) {
  var valid = true;

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, "api") && valid;
  valid = compare(pass, process.env.API_BASIC_AUTH_PW) && valid;

  return valid;
}
