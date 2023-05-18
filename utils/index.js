const axios = require("axios");
const { OpenAIApi } = require("openai");

async function wikiContent(url) {
  try {
    // Fetch the Wikipedia page
    const response = await axios.get(url);
    const wikiHTML = response.data;

    // Extract the content using regular expressions
    const contentRegex = /<p>(.*?)<\/p>/g; // Regex to match paragraph tags
    const matches = wikiHTML.match(contentRegex);

    if (matches) {
      // Remove HTML tags and extract the plain text content
      const plainTextRegex = /(<([^>]+)>)/gi; // Regex to match HTML tags
      const plainTextContent = matches
        .map((match) => match.replace(plainTextRegex, ""))
        .join(" ");

      return plainTextContent;
    } else {
      throw new Error("No content found in the Wikipedia article.");
    }
  } catch (error) {
    console.error(error);
  }
}

const api_key = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({
  api_key,
});

async function fetchWikiAndAskQuestion(url, question) {
  try {
    // Fetch the Wikipedia page
    let content = await wikiContent(url);

    content = `I have read the following document: ${content}\n\n${question}}`;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${api_key}`, // Replace with your API key
          },
        }
      );
      console.log(response.data);

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

// Usage
fetchWikiAndAskQuestion(
  "https://en.m.wikipedia.org/wiki/2023_Turkish_presidential_election",
  "What are results of the election? return 0 if erdogan won, return 1 if kemal won, return 2 if not sure/unknown"
)
  .then((answer) => console.log(answer))
  .catch((error) => console.error(error));
