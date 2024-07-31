// app/api/card/route.js
import { createCanvas, registerFont ,Image} from "canvas";
import path from "path";
// 绕排文本函数
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
      } else {
          line = testLine;
      }
  }
  context.fillText(line, x, y);
}
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 加载专辑封面图像
  const albumImg = new Image();
  albumImg.src = 'https://p2.music.126.net/nNg4YjkcK1AwCX1FrN8VOQ==/109951166578333625.jpg';
  
  // 等待图像加载完成
  await new Promise((resolve) => {
      albumImg.onload = resolve;
  });

  // 绘制专辑封面
  ctx.drawImage(albumImg, 20, 20, 100, 100); // x, y, width, height

  // 设置文本样式
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // 绘制评论文本
  const commentText = "我给她梳过头发，洗过澡，穿过衣服做过饭，亲她掉下来的眼泪，吃她剩下来的东西，" +
                      "她邹下眉头我都会紧张，我们吵过架，但是我都会放下所有的情绪去哄她，" +
                      "冬天冷了我会握住她的手，生病了我会喂她吃药，哄她睡觉，什么时候都是让着她，" +
                      "我很清楚一个女孩爱的样子。所以我依然很清楚的记得她背叛我的样子";
  wrapText(ctx, commentText, 140, 20, 450, 20); // 绕排文本

  // 绘制作者信息
  ctx.font = '14px Arial';
  ctx.fillText('来自 @不是陈易辰', 140, 180);
  ctx.fillText('在「删了吧」', 140, 200);
  ctx.fillText('歌曲下方的评论', 140, 220);
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
