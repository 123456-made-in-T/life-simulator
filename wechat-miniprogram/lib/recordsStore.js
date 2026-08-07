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
