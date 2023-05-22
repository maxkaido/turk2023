const express = require("express");
const axios = require("axios");
const { OpenAIApi } = require("openai");
const expressRedisCache = require("express-redis-cache");
const app = express();
const port = process.env.PORT || 3000;

const cache = expressRedisCache({
  expire: 24 * 60 * 60,
  client: require("redis").createClient(
    process.env.REDIS_URL || "redis://localhost:6379"
  ),
}); // Cache for 24 hours

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

    content = `I have read the following document: ${content}\n\n${question}`;
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

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

app.get("/results", cache.route(), async (req, res) => {
  try {
    const answer = await fetchWikiAndAskQuestion(
      "https://en.m.wikipedia.org/wiki/2023_Turkish_presidential_election",
      "What is the outcome of the 2023 Turkish presidential election? Please respond with 'Erdogan' if Erdogan won, 'Kemal' if Kemal won, or 'n/a' if the result is not known or uncertain."
    );
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
