// 战绩分享图绘制：只依赖标准 Canvas2D API，web 与小程序两端共用。
// 调用方自备 canvas 与 ctx，本模块负责把一世战绩画成 750×1100 的水墨风卡片。

export const CARD_WIDTH = 750;
export const CARD_HEIGHT = 1100;

const PAPER = '#f2ecdf';
const INK = '#2a2620';
const SOFT = '#6b6355';
const CINNABAR = '#a83a24';
const INDIGO = '#3d5a63';
const GOLD = '#9a7b2d';
const LINE = 'rgba(42, 38, 32, 0.2)';

const GRADE_COLORS = { 仙: GOLD, S: CINNABAR, A: INDIGO, B: SOFT, C: SOFT, D: SOFT };
const TONE_COLORS = { breakthrough: INDIGO, ascend: GOLD, death: CINNABAR };
const SERIF = "'Noto Serif SC', 'STKaiti', 'KaiTi', serif";

export function drawShareCard(ctx, payload) {
  const { summary, seed, highlights } = payload;
  const w = CARD_WIDTH;
  const h = CARD_HEIGHT;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.lineWidth = 10;
  ctx.strokeRect(44, 44, w - 88, h - 88);

  ctx.textAlign = 'center';
  ctx.fillStyle = SOFT;
  ctx.font = `26px ${SERIF}`;
  ctx.fillText('问道赴长生 · 修仙人生模拟器', w / 2, 112);

  ctx.fillStyle = GRADE_COLORS[summary.grade] || SOFT;
  ctx.font = `bold 150px ${SERIF}`;
  ctx.fillText(summary.grade, w / 2, 280);

  ctx.fillStyle = INK;
  ctx.font = `bold 54px ${SERIF}`;
  ctx.fillText(summary.title, w / 2, 372);

  ctx.fillStyle = SOFT;
  ctx.font = `28px ${SERIF}`;
  ctx.fillText(
    `${summary.difficultyName}模式 · ${summary.realmName} · ${summary.age} 岁 · 评分 ${summary.score}`,
    w / 2, 426,
  );

  drawDivider(ctx, w, 466);

  let y = 522;
  const achievements = summary.achievements.slice(0, 5);
  if (achievements.length > 0) {
    ctx.fillStyle = GOLD;
    ctx.font = `30px ${SERIF}`;
    for (const name of achievements) {
      ctx.fillText(`「${name}」`, w / 2, y);
      y += 46;
    }
  } else {
    ctx.fillStyle = SOFT;
    ctx.font = `28px ${SERIF}`;
    ctx.fillText('此生未竟寸功，来世再战', w / 2, y);
    y += 46;
  }

  drawDivider(ctx, w, y + 6);
  y += 52;

  ctx.textAlign = 'left';
  ctx.font = `24px ${SERIF}`;
  for (const log of highlights.slice(0, 6)) {
    ctx.fillStyle = SOFT;
    ctx.fillText(log.ageText ?? `${log.age}岁`, 96, y);
    ctx.fillStyle = TONE_COLORS[log.tone] || INK;
    ctx.fillText(truncate(log.text, 22), 186, y);
    y += 42;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = SOFT;
  ctx.font = `24px ${SERIF}`;
  ctx.fillText(`命盘编号 #${seed}`, w / 2, h - 118);
  ctx.fillStyle = INK;
  ctx.font = `28px ${SERIF}`;
  ctx.fillText('一念入道，百年浮生', w / 2, h - 74);
}

function drawDivider(ctx, w, y) {
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(96, y);
  ctx.lineTo(w - 96, y);
  ctx.stroke();
}

function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/** 从完整日志里挑出值得上卡片的高光时刻 */
export function pickHighlights(logs) {
  return logs.filter((log) => TONE_COLORS[log.tone]).slice(-6);
}
