// app/api/card/route.js
import { createCanvas, Image } from "canvas";
import axios from "axios";
// 绕排文本函数
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

export async function GET(req) {
  let renderData = null;
  // 获取请求数据  https://moyu-server.wangyitu.tech/api/proxy?url=https://tenapi.cn/v2/comment
  // 发送 GET 请求
  await axios
    .get(
      "https://moyu-server.wangyitu.tech/api/proxy?url=https://tenapi.cn/v2/comment?t=" +
        new Date().getTime()
    )
    // await axios.get('https://tenapi.cn/v2/comment')
    .then((response) => {
      renderData = response.data["apiData"]["data"];
    })
    .catch((error) => {
      renderData = {
        id: "1460656959",
        songs: "你走",
        sings: "Cheng橙zzzz",
        album: "你走（完整版）",
        cover:
          "https://p2.music.126.net/nNg4YjkcK1AwCX1FrN8VOQ==/109951166578333625.jpg",
        url: "https://music.163.com/song/media/outer/url?id=1460656959.mp3",
        name: "Cheng橙zzzz",
        comment:
          "我给她梳过头发，洗过澡，穿过衣服做过饭，亲她掉下来的眼泪，吃她剩下来的东西，她邹下眉头我都会紧张，我们吵过架，但是我都会放下所有的情绪去哄她，冬天冷了我会握住她的手，生病了我会喂她吃药，哄她睡觉，什么时候都是让着她，我很清楚一个女孩爱的样子。所以我依然很清楚的记得她背叛我的样子",
      };
    });
  if (!renderData) {
    return new Response(JSON.stringify({ error: "请求数据失败" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  console.log(renderData);

  axios({
    method: "post",
    url: "https://moyu.wangyitu.tech/api/notion/db",
    headers: {
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      databaseId: "abfb62478fc2435797ffa9c2ee27a0b4",
      model: {
        id: "title", 
        sings: "rich_text",
        album: "rich_text",
        cover: "rich_text",
        url: "rich_text",
        name: "rich_text",
        comment: "rich_text",
      },
      type: "add",
      data: {
        id:renderData['id'], 
        sings:renderData['sings'],
        album:renderData['album'],
        cover:renderData['cover'],
        url:renderData['url'],
        name:renderData['name'],
        comment:renderData['comment'],
      },
    }),
  })
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

  const width = 400;
  // const height = 800;
  // 创建专辑封面图像
  const albumImg = new Image();
  albumImg.src = renderData.cover;

  // 等待图像加载完成
  await new Promise((resolve) => {
    albumImg.onload = resolve;
  });

  // 绘制评论文本
  const commentText = renderData.comment;

  // 绘制评论文本，设置 y 坐标为图片底部
  let textY = (albumImg.height / albumImg.width) * width + 10; // 图片底部加一点间距

  const splits = commentText.split(/[\r\n]+/);
  const commentTexts = [];
  for (let i = 0; i < splits.length; i++) {
    const split = splits[i];
    if (split.length > 0) {
      commentTexts.push(split.slice(0, 21));
      for (let i = 21; i < split.length; i += 23) {
        commentTexts.push(split.slice(i, i + 23));
      }
    }
  }

  const height =
    (albumImg.height / albumImg.width) * width +
    10 +
    // + ((commentTexts.length - 4) * 20)
    (120 + 140);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 绘制专辑封面，固定宽度为 Canvas 的宽度
  ctx.drawImage(
    albumImg,
    0,
    0,
    width,
    (albumImg.height / albumImg.width) * width
  ); // x, y, width, height

  // 设置文本样式
  ctx.fillStyle = "#333";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  for (let i = 0; i < commentTexts.length; i++) {
    if (i === 0) {
      ctx.font = "62px Arial";
      // “  ‟
      wrapText(ctx, "“", 10, textY + i * 20 - 10, width - 20, width - 20, 20);
      ctx.font = "16px Arial";
      wrapText(
        ctx,
        commentTexts[i],
        40,
        textY + i * 20,
        width - 20,
        width - 20,
        50
      );
    } else {
      ctx.font = "16px Arial";
      wrapText(
        ctx,
        commentTexts[i],
        10,
        textY + i * 20,
        width - 20,
        width - 20,
        50
      ); // 绕排文本
    }
  }

  textY += (commentTexts.length - 4) * 20;
  // wrapText(ctx, commentText, 10, textY, width - 20, 20); // 绕排文本

  // 绘制作者信息
  ctx.font = "14px Arial";
  ctx.textAlign = "right";
  ctx.fillText("来自 @" + renderData["name"], canvas.width - 10, textY + 100); // x 坐标为 canvas.width - 10
  ctx.fillText(
    "在「" + renderData["album"] + "」",
    canvas.width - 10,
    textY + 120
  );
  ctx.fillText("歌曲下方的评论", canvas.width - 10, textY + 140);

  // 生成图片的二进制流
  const buffer = canvas.toBuffer("image/png");

  // 设置响应头
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": buffer.length,
    },
  });
}
