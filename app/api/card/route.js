// app/api/card/route.js
import { createCanvas, registerFont } from 'canvas';
import path from 'path';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const width = searchParams.get('width');
  const height = searchParams.get('height');

  // 检查参数
  if (!text || !width || !height) {
    return new Response(JSON.stringify({ error: '缺少参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 注册字体
  registerFont(path.join(process.cwd(), 'public/fonts/Huiwen_mingchao.d44cbfa9.ttf'), { family: 'Huiwen_mingchao' });

  // 创建画布
  const width1 = parseInt(width, 10);
  const height1 = parseInt(height, 10);
  const canvas = createCanvas(width1, height1);
  const ctx = canvas.getContext('2d');

  // 设置背景色
  // ctx.fillStyle = 'rgb(255, 255, 255)'; // 外部背景色
  ctx.fillRect(0, 0, width1, height1);

  // 设置文本框背景色
  ctx.fillStyle = 'rgb(243, 244, 246)'; // 内部背景色
  ctx.fillRect(0, 0, width1, height1 * 0.8); // 设定文本框高度

  // 设置字体样式
  ctx.font = '34.58px "Huiwen_mingchao", sans-serif';
  ctx.fillStyle = 'rgb(1, 51, 101)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

    // // 绘制边框
    // ctx.strokeStyle = 'rgb(1, 51, 101)'; // 边框颜色
    // ctx.lineWidth = 2; // 边框宽度
    // ctx.strokeRect(0, 0, width1, height1 * 0.8); // 绘制边框

  // 绘制文字
  const lines = text.split('\\n');
  lines.forEach((line, index) => {
    ctx.fillText(line, 20, 24 + index * 50); // 设定行间距
  });

  // 生成图片的二进制流
  const buffer = canvas.toBuffer('image/png');

  // 设置响应头
  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    },
  });
}