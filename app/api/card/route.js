// app/api/card/route.js
import { createCanvas, registerFont } from "canvas";
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if(!searchParams.get("text")){
    return new Response(JSON.stringify({ 
        'card demo1':"/api/card?text=C%27est%20ça%2C%20la%20vie.%0A这就是人生%0ATime%20and%20Tide%0A朝露の儚さ%0A%0Ahttps%3A%2F%2Fcard.pomodiary.com&width=552"
       ,'card2 demo1':"/api/card/card2"
       ,'card3 demo1':"/api/card/card3?cover=https://p2.music.126.net/nNg4YjkcK1AwCX1FrN8VOQ==/109951166578333625.jpg&comment=我给她梳过头发，洗过澡，穿过衣服做过饭，亲她掉下来的眼泪，吃她剩下来的东西，她邹下眉头我都会紧张，我们吵过架，但是我都会放下所有的情绪去哄她，冬天冷了我会握住她的手，生病了我会喂她吃药，哄她睡觉，什么时候都是让着她，我很清楚一个女孩爱的样子。所以我依然很清楚的记得她背叛我的样子&name=Cheng橙zzzz&album=你走（完整版）"
       ,'card3 demo2':"/api/card/card3?api=-"
     }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const text = searchParams.get("text") || `C'est ça, la vie.
这就是人生
Time and Tide
朝露の儚さ

https://card.pomodiary.com`
  // 绘制文字
  const lines = text.split("\n");
  const signature = searchParams.get("signature") || "";
  const width = searchParams.get("width") || 600;
  const height = searchParams.get("height") || 24*2 + (lines.length+1) * 50 + (signature.length>0?50:0);
  const radius = searchParams.get("radius") || 20;
  // 检查参数
  if (!text || !width || !height) {
    return new Response(JSON.stringify({ error: "缺少参数" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 注册字体
  registerFont(
    path.join(process.cwd(), "public/fonts/Huiwen_mingchao.d44cbfa9.ttf"),
    { family: "Huiwen_mingchao" }
  );

  // 创建画布
  const width1 = parseInt(width, 10);
  const height1 = parseInt(height, 10);
  const canvas = createCanvas(width1, height1);
  const ctx = canvas.getContext("2d");

  // // 设置背景色
  // // ctx.fillStyle = 'rgb(255, 255, 255)'; // 外部背景色
  // ctx.fillRect(0, 0, width1, height1);
  // ctx.fillStyle = 'rgb(243, 244, 246)'; //   设置文本框背景色   内部背景色
  // ctx.fillRect(0, 0, width1, height1 * 1); // 设定文本框高度

  // BEGIN 绘制带圆角的矩形
  ctx.beginPath();
  ctx.moveTo(radius, 0); // 左上角
  ctx.lineTo(width1 - radius, 0); // 上边
  ctx.quadraticCurveTo(width1, 0, width1, radius); // 右上角
  ctx.lineTo(width1, height1 - radius); // 右边
  ctx.quadraticCurveTo(width1, height1, width1 - radius, height1); // 右下角
  ctx.lineTo(radius, height1); // 下边
  ctx.quadraticCurveTo(0, height1, 0, height1 - radius); // 左下角
  ctx.lineTo(0, radius); // 左边
  ctx.quadraticCurveTo(0, 0, radius, 0); // 左上角
  ctx.closePath();
  ctx.fillStyle = "rgb(243, 244, 246)"; // 背景色
  ctx.fill(); // 填充背景色
  // END 绘制带圆角的矩形

  // 设置字体样式
  ctx.font = '34.58px "Huiwen_mingchao", sans-serif';
  ctx.fillStyle = "rgb(1, 51, 101)";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // // 绘制边框
  // ctx.strokeStyle = 'rgb(1, 51, 101)'; // 边框颜色
  // ctx.lineWidth = 2; // 边框宽度
  // ctx.strokeRect(0, 0, width1, height1 * 0.8); // 绘制边框

  lines.forEach((line, index) => {
    ctx.fillText(line, 20, 24 + index * 50); // 设定行间距
  }); 
  ctx.font = '24.58px "Huiwen_mingchao", sans-serif';
  signature&&ctx.fillText(signature, 20, 24 + (lines.length) * 50); 
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
