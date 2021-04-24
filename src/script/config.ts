export default class Config {
  private static _instance: Config;
  static getInstance(): Config {
    if (!this._instance) this._instance = new Config();
    return this._instance;
  }
  private constructor() {
    this.init();
  }

  // 配置键
  KEY_RECORD = "record"; // 棋局记录

  KEY_TRUE_SCORE = "trueScore"; // 蓝方分数
  KEY_FALSE_SCORE = "falseScore"; // 红方分数
  KEY_PLAYER_SCORE = "playerScore"; // 玩家分数
  KEY_AI_SCORE = "AIScore"; // 电脑分数

  KEY_IS_PVP = "isPVP"; // 是否双人模式
  KEY_IS_DARK_THEME = "isDarkTheme"; // 是否夜间主题
  KEY_IS_TRUE_CHESS = "isTrueChess"; // 是否为蓝方回合
  KEY_IS_PLAYING_GAME = "isPlayingGame"; // 游戏是否进行中
  KEY_IS_OVER = "isOver"; // 游戏是否结束
  KEY_IS_LOCK = "isLock"; // 落子是否锁定

  KEY_MSG = "msg"; // 游戏提示

  // 默认数据
  VALUE_NULL_RECORD = "NNNNNNNNN";

  // 存储体
  private db = localStorage;

  // 字符串存取
  setStr(key: string, value: string) {
    this.db.setItem(key, JSON.stringify(value));
  }
  getStr(key: string): string {
    return JSON.parse(this.db.getItem(key));
  }

  // 数值存取
  setNum(key: string, num: number) {
    this.db.setItem(key, JSON.stringify(num));
  }
  getNum(key: string): number {
    return JSON.parse(this.db.getItem(key));
  }

  // 布尔值存取
  setBool(key: string, bool: boolean) {
    this.db.setItem(key, JSON.stringify(bool));
  }
  getBool(key: string): boolean {
    return JSON.parse(this.db.getItem(key));
  }

  has(key: string): boolean {
    return this.db.hasOwnProperty(key);
  }

  // 初始化数据
  init() {
    // 分数
    this.has(this.KEY_TRUE_SCORE) || this.setNum(this.KEY_TRUE_SCORE, 0);
    this.has(this.KEY_FALSE_SCORE) || this.setNum(this.KEY_FALSE_SCORE, 0);
    this.has(this.KEY_PLAYER_SCORE) || this.setNum(this.KEY_PLAYER_SCORE, 0);
    this.has(this.KEY_AI_SCORE) || this.setNum(this.KEY_AI_SCORE, 0);

    // 设置
    this.has(this.KEY_IS_PVP) || this.setBool(this.KEY_IS_PVP, false);
    this.has(this.KEY_IS_DARK_THEME) ||
      this.setBool(this.KEY_IS_DARK_THEME, false);

    // 棋局状态 必须全部正常
    if (
      !this.has(this.KEY_RECORD) ||
      !this.has(this.KEY_IS_TRUE_CHESS) ||
      !this.has(this.KEY_IS_PLAYING_GAME) ||
      !this.has(this.KEY_IS_OVER) ||
      !this.has(this.KEY_IS_LOCK)
    )
      this.statusRestart();
  }

  // 棋局状态重置
  statusRestart() {
    this.setStr(this.KEY_RECORD, this.VALUE_NULL_RECORD);
    this.setBool(this.KEY_IS_TRUE_CHESS, true);
    this.setBool(this.KEY_IS_PLAYING_GAME, false);
    this.setBool(this.KEY_IS_OVER, false);
    this.setBool(this.KEY_IS_LOCK, false);
  }
}
