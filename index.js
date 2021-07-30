const { Client } = require("@notionhq/client");
const axios = require("axios");
const moment = require("moment");

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// // Dateをフォーマットする関数
// function formatDate(date, format) {
//   format = format.replace(/yyyy/g, date.getFullYear());
//   format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
//   format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2));
//   format = format.replace(/HH/g, ("0" + date.getHours()).slice(-2));
//   format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
//   format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
//   format = format.replace(/SSS/g, ("00" + date.getMilliseconds()).slice(-3));
//   return format;
// }

// // 今日の日付を取得
// let date = new Date();
// date.setDate(date.getDate() - 1);
// const yesterday = formatDate(date, "yyyy-MM-dd");
// console.log(yesterday);

const config = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: {
    text: "",
  },
};

exports.handler = async function () {
  // TODO implement
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify("Hello from Lambda!"),
  // };

  const yesterday = moment().add(-1, "days").format("YYYY-MM-DD");

  const myPage = await notion.databases.query({
    database_id: "d2194450505742bea642149fb7aecab2",
    filter: {
      property: "作成日時",
      date: {
        equals: yesterday,
      },
    },
  });

  const titleList = [];
  const results = myPage.results;
  await titleList.push("昨日作成された論文");
  results.map((result) => {
    const tagList = [];
    const tags = result.properties["タグ"].multi_select;
    tags.map((tag) => {
      tagList.push(" " + tag.name + " ");
    });
    titleList.push(
      "・【" +
        result.properties["作成者"].created_by.name +
        "】 <" +
        result.url +
        "|" +
        result.properties["論文名"].title[0].text.content +
        "> (" +
        tagList +
        ")"
      // "・【" + result.properties["作成者"].created_by.name + "】 <" + result.url + "|" + result.properties["論文名"].title[0].text.content + ">"
    );
    console.log("論文タイトル：", result.properties["論文名"].title[0].text.content);
    console.log("Test a");
  });

  config.data.text = await titleList.join("\n");

  // console.log(myPage.results[1].properties["論文名"].title[0].text.content);

  await axios(process.env.WEBHOOK_URL, config)
    .then(function (res) {
      console.log("axios res:", res);
    })
    .catch(function (error) {
      console.error(error);
    });

  // return response;
};
