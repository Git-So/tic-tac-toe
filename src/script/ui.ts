import AI from "./ai";
import Basic from "./basic";
import Game from "./game";
import { $, $$ } from "./helper";

export default class UI extends Basic {
  private static _instance: UI;
  static getInstance(game: Game): UI {
    if (!this._instance) this._instance = new UI(game);
    return this._instance;
  }

  // 文档节点
  htmlEl = $("html");

  //  分数
  trueScoreEl = $("#true-score");
  falseScoreEl = $("#false-score");

  // 配置图标
  gameModeIconEl = $("#game-mode g-icon");
  gameThemeIconEl = $("#game-theme g-icon");
  gameRestartIconEl = $("#game-restart g-icon");

  // 状态栏主题色
  lightThemeColor = "#f2f3f7";
  darkThemeColor = "#181818";
  MetaThemeColorEL = $("meta[name=theme-color]");
  MetaAppleThemeColorEL = $("meta[name=apple-mobile-web-app-status-bar-style]");

  // 棋格
  cellArrEl = $$("g-cell");

  // 提示框
  alertTextEl = $("g-alert span");

  // 问候
  hello() {
    this.alert(`点击开始游戏，蓝方先手！`);
  }

  //  消息提醒
  alert(msg: string) {
    this.Config.setStr(this.Config.KEY_MSG, msg);
    this.alertTextEl.innerHTML = msg;
  }

  // 同步消息提示
  syncAlert() {
    this.alert(this.Config.getStr(this.Config.KEY_MSG));
  }

  //  切换主题
  syncTheme() {
    let is_dark = this.Config.getBool(this.Config.KEY_IS_DARK_THEME);

    // 切换图标
    this.gameThemeIconEl.setAttribute("name", is_dark ? "dark" : "light");

    // 切换主题
    this.htmlEl.setAttribute("theme", is_dark ? "dark" : "light");

    // Chrome主题色切换
    this.MetaThemeColorEL.setAttribute(
      "content",
      is_dark ? "#181818" : "#f2f3f7"
    );

    // Apple主题色切换
    this.MetaAppleThemeColorEL.setAttribute(
      "content",
      is_dark ? "#181818" : "#f2f3f7"
    );

    // 提示
    this.alert(`切换到${is_dark ? "夜间" : "白天"}模式！`);
  }

  // 同步分数
  syncScore() {
    // 切换分数
    let is_pvp = this.Config.getBool(this.Config.KEY_IS_PVP);
    this.trueScoreEl.innerHTML = is_pvp
      ? this.Config.getNum(this.Config.KEY_TRUE_SCORE).toString()
      : this.Config.getNum(this.Config.KEY_PLAYER_SCORE).toString();
    this.falseScoreEl.innerHTML = is_pvp
      ? this.Config.getNum(this.Config.KEY_FALSE_SCORE).toString()
      : this.Config.getNum(this.Config.KEY_AI_SCORE).toString();
  }

  // 切换人机
  syncGameMode() {
    this.syncScore(); // 同步分数

    let is_pvp = this.Config.getBool(this.Config.KEY_IS_PVP);

    // 切换图标
    this.gameModeIconEl.setAttribute("name", is_pvp ? "pvp" : "pve");

    // 提示
    this.alert(`切换到${is_pvp ? "双人" : "人机"}对战模式！`);
  }

  // 同步棋局状态
  syncChess() {
    let chess_arr = this.Config.getStr(this.Config.KEY_RECORD).split("");

    this.cellArrEl.forEach((el) => {
      let type = chess_arr.shift();
      let icon = type == "T" ? "true" : "false";
      el.innerHTML = type == "N" ? "" : `<g-icon name="${icon}"></g-icon>`;
    });
  }

  // 同步数据到视图
  sync() {
    this.syncScore();
    this.syncGameMode();
    this.syncTheme();
    this.syncChess();
    this.syncAlert();
  }

  // 落子
  play(el: Element) {
    if (!!el.innerHTML) return;
    let is_true_chess = this.Config.getBool(this.Config.KEY_IS_TRUE_CHESS);
    el.innerHTML = `<g-icon name="${is_true_chess.toString()}"></g-icon>`;

    this.Config.setStr(this.Config.KEY_RECORD, this.Data.getChessRecord()); // 保存棋局
    this.Config.setBool(this.Config.KEY_IS_TRUE_CHESS, !is_true_chess); // 切换落子方

    // 落子结果处理
    let is_pvp = this.Config.getBool(this.Config.KEY_IS_PVP);
    let is_win = this.Data.isWin();
    let is_over = is_win ? true : this.Data.isOver();

    // 获胜或平局
    if (is_over) {
      this.Config.setBool(this.Config.KEY_IS_OVER, true);
      this.Config.setBool(this.Config.KEY_IS_PLAYING_GAME, false);
    }
    switch (true) {
      // 获胜
      case is_win:
        // 添加分数
        let pvp_key = is_true_chess
          ? this.Config.KEY_TRUE_SCORE
          : this.Config.KEY_FALSE_SCORE;
        let pve_key = is_true_chess
          ? this.Config.KEY_PLAYER_SCORE
          : this.Config.KEY_AI_SCORE;
        let key = is_pvp ? pvp_key : pve_key;
        this.Config.setNum(key, this.Config.getNum(key) + 1);
        this.syncScore(); // 同步分数

        // 胜利提示
        let pvp_winner = is_true_chess ? "蓝方" : "红方";
        let pve_winner = is_true_chess ? "玩家" : "电脑";
        this.alert(`恭喜${is_pvp ? pvp_winner : pve_winner}获得胜利！`);
        break;
      // 平局
      case is_over:
        this.alert(`游戏结束，平局！`);
        break;
      // AI落子
      case !is_pvp && is_true_chess:
        this.AI.play();
        break;
      default:
        this.alert(`${is_true_chess ? "红" : "蓝"}方请执棋！`);
    }
  }
}
