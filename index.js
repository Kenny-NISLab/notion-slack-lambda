const axios = require("axios");

const config = {
  headers: {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
  },
};

exports.handler = () => {
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };

  axios.get("https://api.notion.com/v1/databases/d2194450505742bea642149fb7aecab2", config).then(function (response) {
    console.log(response);
  });

  // const myPage = await notion.databases.query({
  //   database_id: 'd2194450505742bea642149fb7aecab2',
  //   filter: {
  //     property: '作成日時',
  //     text: {
  //       equals: '2021-07-28',
  //     },
  //   },
  // });

  console.log("a");
  return response;
};
