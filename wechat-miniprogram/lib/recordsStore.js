// 战绩持久化（小程序端 wx 存储；web 端见 src/lib/recordsStore.js）

const RECORDS_KEY = 'wendao-life-records';

export function loadRecords() {
  try {
    const value = wx.getStorageSync(RECORDS_KEY);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn('读取战绩失败:', error);
    return [];
  }
}

export function saveRecords(records) {
  try {
    wx.setStorageSync(RECORDS_KEY, records);
  } catch (error) {
    console.warn('保存战绩失败:', error);
  }
}

export function clearRecords() {
  saveRecords([]);
}

const FRUITS_KEY = 'wendao-dao-fruits';

export function loadFruits() {
  try {
    const value = wx.getStorageSync(FRUITS_KEY);
    const parsed = Number.parseInt(value || '0', 10);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  } catch (error) {
    console.warn('读取道果失败:', error);
    return 0;
  }
}

export function saveFruits(count) {
  try {
    wx.setStorageSync(FRUITS_KEY, String(count));
  } catch (error) {
    console.warn('保存道果失败:', error);
  }
}
