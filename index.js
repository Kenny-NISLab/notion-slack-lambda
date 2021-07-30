const { Client } = require("@notionhq/client");
const axios = require("axios");
const moment = require("moment");

/**
 * Notion クライアントの初期化
 */
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * Slackに通知するためのオプション
 */
const config = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * 日付処理
 */
const yesterday = moment().add(-1, "days");
const yesterdayISO = yesterday.format("YYYY-MM-DD");
const yesterdayFmt = yesterday.format("M月D日");
// const timezone_check = yesterday.format("YYYY-MM-DD HH:mm:ss");

/**
 * Notion databse
 */
const NOTION_DB_ID = "d2194450505742bea642149fb7aecab2";
const NOTION_DB_URL = "https://www.notion.so/nislab/" + NOTION_DB_ID;

/**
 * ハンドラー関数
 */
exports.handler = async function () {
  // Notion からデータを取得
  const results = await get_notion_database();

  // Create message
  if (results.length) {
    config.data = await create_message(results);
  } else {
    config.data = await create_nonpage_message();
  }

  console.log("config.data:", config.data);

  // Slackに送信
  await notify_slack(process.env.WEBHOOK_URL, config);
};

/**
 * Notion から該当ページを取得
 * @returns {Array} - 該当ページ
 */
async function get_notion_database() {
  const response = await notion.databases.query({
    database_id: NOTION_DB_ID,
    filter: {
      property: "作成日時",
      date: {
        equals: yesterdayISO,
      },
    },
  });

  return response.results;
}

/**
 * 該当ページがない場合に Slack に送信するメッセージを作成
 * @returns {Object} - Slack に送信するペイロード
 */
async function create_nonpage_message() {
  return {
    text: "昨日は、論文まとめページが作成されませんでした。",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: yesterdayFmt + "に作成された論文まとめページはありませんでした。",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Notion の 論文まとめ一覧は *<" + NOTION_DB_URL + "|こちら>*",
        },
      },
      {
        type: "divider",
      },
    ],
  };
}

/**
 * Slack に送信するメッセージを作成
 * @param {Array} results
 * @returns {Object} - Slack に送信するペイロード
 */
async function create_message(results) {
  const titleList = [];

  results.map((result) => {
    const tagList = [];
    const tags = result.properties["タグ"].multi_select;
    tags.map((tag) => {
      tagList.push(" `" + tag.name + "` ");
    });

    titleList.push(
      "• [" +
        result.properties["作成者"].created_by.name +
        "] *<" +
        result.url +
        "|" +
        result.properties["論文名"].title[0].text.content +
        ">* " +
        tagList.join("")
    );
  });

  return {
    text: "昨日は、" + results.length + " 個の論文まとめページが作成されました。",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: yesterdayFmt + "に作成された論文まとめページをお知らせします。",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: titleList.join("\n"),
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Notion の 論文まとめ一覧は *<" + NOTION_DB_URL + "|こちら>*",
        },
      },
      {
        type: "divider",
      },
    ],
  };
}

/**
 * Slackに通知
 * @param {string} url
 * @param {object} config
 */
async function notify_slack(url, config) {
  await axios(url, config)
    .then(function (res) {
      console.log("axios success!!:", res);
    })
    .catch(function (error) {
      console.log("axios error:", error);
    });
}
