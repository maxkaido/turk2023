// This example shows how to fetch the outcome of the 2023 Turkish presidential election from a Wikipedia page and use GPT-3 to interpret the result

// Arguments can be provided when a request is initiated on-chain and used in the request source code as shown below
// const wikipediaPageUrl = args[0]
const wikipediaPageUrl = "https://en.m.wikipedia.org/api/rest_v1/page/html/2023_Turkish_presidential_election"

if (!secrets.openaiApiKey) {
  throw Error("Need to set openaiApiKey variable")
}

const openaiApiKey = secrets.openaiApiKey

// Use the Wikipedia API to fetch the HTML of the page
const wikipediaRequest = Functions.makeHttpRequest({
  url: `https://en.m.wikipedia.org/api/rest_v1/page/html/${wikipediaPageUrl}`,
})

// Wait for the response
const wikipediaResponse = await wikipediaRequest

if (wikipediaResponse.error) {
  throw Error("Wikipedia API request failed")
}

// Parse the HTML to find the content of the article
const htmlContent = wikipediaResponse.data
const startIndexOfBackground = htmlContent.indexOf("Background")
const endIndexOfBackground = htmlContent.indexOf("References")
const articleContent = htmlContent.slice(startIndexOfBackground, endIndexOfBackground)

// Use the OpenAI API to interpret the article content
const openaiRequest = Functions.makeHttpRequest({
  url: "https://api.openai.com/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openaiApiKey}`,
  },
  data: {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: articleContent },
      { role: "user", content: "Who won the 2023 Turkish presidential election?" },
    ],
  },
})

// Wait for the response
const openaiResponse = await openaiRequest

if (openaiResponse.error) {
  throw Error("OpenAI API request failed")
}

// The outcome should be 'Erdogan' if Erdogan won, 'Kemal' if Kemal won, or 'n/a' if the result is not known or uncertain
let outcome = openaiResponse.data.choices[0].message.content.trim().toLowerCase()

// Post-process the outcome to ensure it is one of the expected values
if (outcome.includes("erdogan")) {
  outcome = "Erdogan"
} else if (outcome.includes("kemal")) {
  outcome = "Kemal"
} else {
  outcome = "N/A"
}

console.log(`Outcome of the 2023 Turkish presidential election: ${outcome}`)

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeString(outcome)
