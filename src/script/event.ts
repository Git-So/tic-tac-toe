import Basic from "./basic";
import Game from "./game";
import { $, $$ } from "./helper";

export default class Event extends Basic {
  private static _instance: Event;
  static getInstance(game: Game): Event {
    if (!this._instance) this._instance = new Event(game);
    return this._instance;
  }

  // 按钮
  gameModeEl = $("#game-mode");
  gameThemeEl = $("#game-theme");
  gameRestartEl = $("#game-restart");

  // 棋格
  cellArrEl = $$("g-cell");

  //  事件注册
  register() {
    //  切换人机
    this.gameModeEl.addEventListener("click", () => {
      if (this.Config.getBool(this.Config.KEY_IS_PLAYING_GAME)) {
        this.UI.alert(`游戏已经开始无法切换对战模式！`);
        return;
      }

      //  切换人机
      this.Config.setBool(
        this.Config.KEY_IS_PVP,
        !this.Config.getBool(this.Config.KEY_IS_PVP)
      );
      this.UI.syncGameMode();
      this.Config.statusRestart();
      this.UI.syncChess();
    });

    //  切换主题
    this.gameThemeEl.addEventListener("click", () => {
      this.Config.setBool(
        this.Config.KEY_IS_DARK_THEME,
        !this.Config.getBool(this.Config.KEY_IS_DARK_THEME)
      );
      this.UI.syncTheme();
    });

    //  棋局清空
    this.gameRestartEl.addEventListener("click", () => {
      this.Config.statusRestart();
      this.UI.syncChess();
      this.UI.hello();
    });

    // 棋盘落子
    this.cellArrEl.forEach((el) => {
      el.addEventListener("click", () => {
        if (this.Config.getBool(this.Config.KEY_IS_OVER)) return;

        // 游戏进行中
        this.Config.setBool(this.Config.KEY_IS_PLAYING_GAME, true);

        // 落子
        this.Config.getBool(this.Config.KEY_IS_LOCK)
          ? this.UI.alert(`当前不是你的回合！`)
          : this.UI.play(el); //  落子
      });
    });
  }
}
