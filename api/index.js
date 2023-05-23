const express = require("express");
const axios = require("axios");
const { OpenAIApi } = require("openai");
const expressRedisCache = require("express-redis-cache");
const { JSDOM } = require("jsdom");

const app = express();
const port = process.env.PORT || 3000;
const expire = process.env.NODE_ENV === "production" ? 24 * 60 * 60 : 60; // 24 hours in seconds

const cache = expressRedisCache({
  expire: 1,
  client: require("redis").createClient(
    process.env.REDIS_URL || "redis://localhost:6379"
  ),
}); // Cache for 24 hours

async function getIntroSection(url) {
  console.log("fetching url", url);
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const doc = dom.window.document;
    let introSection = "";
    const nodes = doc.querySelectorAll("p");
    for (let node of nodes) {
      if (node.textContent.includes("Background")) break;
      introSection += node.textContent;
    }
    return introSection;
  } catch (error) {
    console.log(error);
  }
}

const api_key = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({
  api_key,
});

async function fetchWikiAndAskQuestion(url, question) {
  try {
    // Fetch the Wikipedia page intro section
    let content = await getIntroSection(url);

    content = `I have read the following document: ${content}\n\n${question}\n\ntimestamp: ${Date.now()}`;
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

app.get("/turk2023", cache.route(), async (req, res) => {
  try {
    const answer = await fetchWikiAndAskQuestion(
      "https://en.m.wikipedia.org/api/rest_v1/page/html/2023_Turkish_presidential_election",
      "What is the outcome of the 2023 Turkish presidential election? Please respond with 'Erdogan' if Erdogan won, 'Kemal' if Kemal won, or 'n/a' if the result is not known or uncertain."
    );
    res.send(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
