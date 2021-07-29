const { Client } = require("@notionhq/client");

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

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
  return response;
};
