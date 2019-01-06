package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/valyala/fastjson"
	resty "gopkg.in/resty.v1"
)

func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/transactions", GetTransactions)
	return router
}

//https://mholt.github.io/json-to-go/
type BudgetTransaction struct {
	ID       string `json:"id"`
	Date     string `json:"date"`
	Amount   int    `json:"amount"`
	Memo     string `json:"memo"`
	Cleared  string `json:"cleared"`
	Approved bool   `json:"approved"`
	Account  string `json:"account"`
	Payee    string `json:"payee"`
	Category string `json:"category"`
}

type MapKey struct {
	Reference, ID string
}

var referenceMap map[MapKey]string

var refObjects = map[string]string{
	"account":  "accounts",
	"payee":    "payees",
	"category": "categories",
}

// GetTransactions : 
func GetTransactions(w http.ResponseWriter, r *http.Request) {
	// Read from YNAB API
	// Get env Token
	var p fastjson.Parser
	var v *fastjson.Value
	var jsonBody string

	if os.Getenv("ENV") != "local" {
		resp, err := resty.R().
			SetHeader("Accept", "application/json").
			SetAuthToken(os.Getenv("TOKEN")).
			Get(os.Getenv("YNAB_API_URL"))

		if err != nil {
			log.Fatalf("Cannot read YNAB API: %s", err)
		}

		jsonBody = string(resp.Body())

	} else {
		readLines := func(path string) ([]string, error) {
			file, err := os.Open(path)
			if err != nil {
				return nil, err
			}
			defer file.Close()

			var lines []string
			scanner := bufio.NewScanner(file)
			scanner.Split(bufio.ScanLines)

			for scanner.Scan() {
				lines = append(lines, string(scanner.Text()))
			}
			return lines, err
		}

		ynabJSON, _ := readLines("data/ynab.json")

		jsonBody = strings.Join(ynabJSON, "")
	}

	v, err := p.Parse(jsonBody)

	if err != nil {
		log.Fatalf("cannot parse json: %s", err)
	}

	// Create maps for easy look up
	// loop through each object we need a map for
	for i, refObject := range refObjects {
		jsonArray := v.Get("data", "budget", refObject).GetArray()

		// populate the MapKey struct to easily find the name for the given object & ID
		// https://blog.golang.org/go-maps-in-action (Key types)
		for _, record := range jsonArray {
			id := string(record.Get("id").GetStringBytes())
			name := string(record.Get("name").GetStringBytes())
			referenceMap[MapKey{i, id}] = name
		}
	}
	var getString = func(key string, fastJson *fastjson.Value) string {
		if refObjects[key] != "" {
			value := string(fastJson.Get(key).GetStringBytes())
			return referenceMap[MapKey{key, value}]
		}
		return string(fastJson.Get(key).GetStringBytes())
	}

	// Loop through each transaction and format an output json object
	var outputObject []BudgetTransaction

	transactionsJsonArray := v.Get("data", "budget", "transactions").GetArray()

	for _, ynabTransaction := range transactionsJsonArray {
		//([a-z]+).+string `json:"(.+)".+
		object := BudgetTransaction{
			ID:       getString("id", ynabTransaction),
			Date:     getString("date", ynabTransaction),
			Amount:   int(ynabTransaction.Get("amount").GetInt()),
			Memo:     getString("memo", ynabTransaction),
			Cleared:  getString("cleared", ynabTransaction),
			Approved: bool(ynabTransaction.Get("approved").GetBool()),
			Account:  getString("account", ynabTransaction),
			Payee:    getString("payee", ynabTransaction),
			Category: getString("category", ynabTransaction),
		}

		outputObject = append(outputObject, object)
	}

	render.JSON(w, r, outputObject) // A chi router helper for serializing and returning json
}
