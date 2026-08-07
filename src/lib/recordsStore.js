// 战绩持久化（web 端 localStorage；小程序端见 wechat-miniprogram/lib/recordsStore.js）

const RECORDS_KEY = 'wendao-life-records';

export function loadRecords() {
  try {
    const raw = window.localStorage.getItem(RECORDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('读取战绩失败:', error);
    return [];
  }
}

export function saveRecords(records) {
  try {
    window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('保存战绩失败:', error);
  }
}

export function clearRecords() {
  saveRecords([]);
}
