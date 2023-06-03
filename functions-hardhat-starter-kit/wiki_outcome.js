if (!secrets.openaiApiKey) {
  throw Error("Need to set openaiApiKey variable")
}
const api_key = secrets.openaiApiKey

async function getArticle(url) {
  console.log("fetching url", url)
  try {
    const response = await Functions.makeHttpRequest({ url })
    const paragraphs = response.data.split("<p>").slice(1)
    let introSection = ""
    for (const paragraph of paragraphs) {
      if (paragraph.includes("Links")) break
      const text = paragraph.replace(/<[^>]*>/g, "") // Remove HTML tags
      introSection += text
    }
    // console.log("introSection", introSection);
    // return first N words
    introSection = introSection.split(" ").slice(0, 100).join(" ")
    console.log("introSection", introSection)
    return introSection
  } catch (error) {
    console.log(error)
  }
}

async function fetchWikiAndAskQuestion(url, question) {
  try {
    // Fetch the Wikipedia page intro section
    let content = await getArticle(url)
    console.log("content", content)

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
          Authorization: `Bearer ${api_key}`, // Replace with your API key
        },
      })
      const openaiResponse = await openaiRequest
      // console.log("openaiResponse", openaiResponse)

      if (openaiResponse.error) {
        throw Error("OpenAI API request failed")
      }

      return openaiResponse.data.choices[0].message.content
    } catch (error) {
      console.error(error)
    }
  } catch (error) {
    console.error(error)
  }
}

const answer = await fetchWikiAndAskQuestion(
  "https://en.wikipedia.org/api/rest_v1/page/html/2023_Turkish_presidential_election",
  "What is the outcome of the 2023 Turkish presidential election? Please respond with 'Erdogan' if Erdogan won, 'Kemal' if Kemal won, or 'n/a' if the result is not known or uncertain."
)

console.log("answer", answer)

return Functions.encodeString(answer)
