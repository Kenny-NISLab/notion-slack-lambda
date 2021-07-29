const { Client } = require("@notionhq/client");
const axios = require("axios");

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const config = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    text: "Hello",
  },
};

exports.handler = async function () {
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };

  const myPage = await notion.databases.query({
    database_id: "d2194450505742bea642149fb7aecab2",
    filter: {
      property: "作成日時",
      date: {
        equals: "2021-07-23",
      },
    },
  });

  const results = myPage.results;
  results.map((result) => {
    console.log(result.properties["論文名"].title[0].text.content);
  });
  console.log(myPage.results[1].properties["論文名"].title[0].text.content);
  console.log("a");
  axios(process.env.WEBHOOK_URL, config);
  return response;
};
