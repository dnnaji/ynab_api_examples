# You Need a Budget (YNAB) API - Examples / Experiments
I have been a fan of [YNAB's](https://ynab.com/referral/?ref=OLj2GyRGnN2oeQ1K&utm_source=customer_referral) budgeting software for several years. They have recently launched a robust API and prior to that a wonderful SPA.  I also appreciate their [tech stack](https://app.youneedabudget.com/humans.txt) too.

**API Documentation**: https://api.youneedabudget.com

As for this GitHub repo, I have stored my experiments of exploring their API.


## My Use Case

I wanted a simple way for my wife to see the "Household Budget" in a format she could manipulate and was familiar with. In parallel, I was looking for a mini project to explore new tech like MuleSoft, Vue.js, Golang, etc.

## Summary

I use [MuleSoft](https://www.mulesoft.com/) at work to integrate on-premise apps to the cloud. The logic I needed could be managed by a "[Process API](https://www.mulesoft.com/sites/default/files/resource-assets/API-led-connectivity-new-soa-updated.pdf)." The free version of MuleSoft does not support [DataWeave](https://docs.mulesoft.com/mule-runtime/4.1/dataweave) so I looked elsewhere. Additionally, I was not interested in configuring a hosted the Mule runtime.

My first attempt was a Vue.js app but ended up not being the right direction.

After learning about now.sh, I figured I make a Serverless API with Golang which could contain the Process API logic.  I was not able to get it to work as desired with Now v2.

My working attempt was to create a simple Node.js API, host it on now.sh and set up a daily trigger with Google Apps Script to load the budget transactions into a Google Sheet.

Respective code examples can be found in each folder.

