// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Global from "../../Global"

@ccclass
export default class GameOver extends cc.Component {

    @property({
		type: cc.Node,
		tooltip: "Home Scene"
	})
	HomeBtn: cc.Node = null;

    @property({
    	type: cc.Node,
    	tooltip: "Restart"
    })
    RestartBtn: cc.Node = null;
	
	@property({
		tooltip: "old",
		type: cc.Node
	})
	oldScoreText: cc.Node = null;
	
	@property({
		tooltip: "new",
		type: cc.Node
	})
	newScoreText: cc.Node = null;
	
	@property({
		tooltip: "score",
		type: cc.Label
	})
	scoreLabel: cc.Label = null;
	
	@property({
		tooltip: "playerData",
		type: cc.Node
	})
	playerData: cc.Node = null;
	
	@property({
		tooltip: "Global, playerData",
		type: Global
	})
	public Global: Global = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.onTouch();
		
		// active
		this.oldScoreText.active = false;
		this.newScoreText.active = false;
		this.test.active = false;
	}

    start () {
		// cc.log(this.playerData.getComponent("PlayerData").Score);
		// 也许用全局变量保存好一点？？？
		// this.scoreLabel.string = this.playerData.getComponent("PlayerData").Score;
		let oldScore = cc.sys.localStorage.getItem("maxScore");
		this.scoreLabel.string = this.Global.nowScore;
		if(oldScore && oldScore < this.Global.nowScore) {
			this.newScoreText.active = true;
		}else if(oldScore && oldScore > this.Global.nowScore){
			this.oldScoreText.active = true;
		}
    }

    // update (dt) {}
	
	onTouch() {
		this.HomeBtn.on(cc.Node.EventType.TOUCH_START, this.onTouchHome, this);
		
		this.RestartBtn.on(cc.Node.EventType.TOUCH_START, this.onTouchRestart, this);
	}
	
	onTouchHome() {
		cc.director.loadScene("HomeScene");
	}
	
	onTouchRestart() {
		// cc.log('a');
		cc.director.loadScene("GameScene");
	}
	
	onDestroy() {
		this.HomeBtn.off(cc.Node.EventType.TOUCH_START, this.onTouchHome, this);
		
		this.RestartBtn.off(cc.Node.EventType.TOUCH_START, this.onTouchRestart, this);
	}
}
