// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
	
	@property({
		tooltip: "playerData.json",
		type: cc.JsonAsset
	})
	playerDataJson: cc.JsonAsset = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		// 获取碰撞检测系统
		let manager = cc.director.getCollisionManager();
		// 开启碰撞检测
		manager.enabled = true;
		// 开启 debug 的绘制
		manager.enabledDebugDraw = true;
	}

    start () {
		cc.director.preloadScene("GameScene", function () {
		    cc.log("this scene preloaded");
		});
		cc.director.preloadScene("HomeScene", function () {
		    cc.log("home scene preloaded");
		});
    }

    // update (dt) {}
}
