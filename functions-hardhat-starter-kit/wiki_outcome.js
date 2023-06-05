if (!secrets.openaiApiKey) {
  throw new Error("Need to set openaiApiKey variable")
}
const api_key = secrets.openaiApiKey

async function getArticle(url) {
  console.log("Fetching URL:", url)
  try {
    const response = await Functions.makeHttpRequest({ url })
    const paragraphs = response.data.split("<p>").slice(1)
    let introSection = paragraphs.map((paragraph) => paragraph.replace(/<[^>]*>/g, "")).join("")
    introSection = introSection.split(" ").slice(0, 100).join(" ")
    console.log("Intro section:", introSection)
    return introSection
  } catch (error) {
    console.error("Error in getArticle:", error)
  }
}

async function fetchWikiAndAskQuestion(url, question) {
  try {
    let content = await getArticle(url)
    console.log("Content:", content)
    content = `I have read the following document: ${content}\n\n${question}\n\ntimestamp: ${Date.now()}`
    try {
      const openaiRequest = Functions.makeHttpRequest({
        url: "https://api.openai.com/v1/chat/completions",
        method: "POST",
        data: {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content }],
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
      })
      const openaiResponse = await openaiRequest
      if (openaiResponse.error) {
        throw new Error("OpenAI API request failed")
      }

      function calculatePrice(tokens) {
        const pricePerToken = 0.002 / 1000 // $0.002 per 1000 tokens
        return tokens * pricePerToken
      }

      const totalTokens = openaiResponse.data.usage.total_tokens
      const price = calculatePrice(totalTokens)
      console.log(`Cost of the request: $${price}`)
      return openaiResponse.data.choices[0].message.content
    } catch (error) {
      console.error("Error in OpenAI request:", error)
    }
  } catch (error) {
    console.error("Error in fetchWikiAndAskQuestion:", error)
  }
}

async function main() {
  const answer = await fetchWikiAndAskQuestion(
    "https://en.wikipedia.org/api/rest_v1/page/html/2023_Turkish_presidential_election",
    "What is the outcome of the 2023 Turkish presidential election? Please respond exactly with 'Erdogan' if Erdogan won, 'Kemal' if Kemal won, or 'n/a' if the result is not known or uncertain. Do not put a dot at the end"
  )
  console.log("Answer:", answer)
  // Remove the dot at the end of the answer
  const answerWithoutDot = answer.replace(/\.$/, "")
  console.log("Answer without dot:", answerWithoutDot)

  return Functions.encodeString(answerWithoutDot)
}

return main().catch(console.error)
