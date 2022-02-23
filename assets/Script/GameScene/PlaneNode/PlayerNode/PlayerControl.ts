// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {

	@property({
		type: cc.Node,
		tooltip: "player"
	})
	player: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
	}

	onTouchMove(event) {
		// getDelta() 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性
		let delta = event.getDelta();
		// 改变位置
		this.player.position = delta.add(this.player.position);
		// 限制位置
		let width = this.player.getChildByName("plane").width;
		let height = this.player.getChildByName("plane").height;
		if(this.player.x >= cc.winSize.width/2 - width/2 ) {
			this.player.x = cc.winSize.width/2 - width/2;
		}else if(this.player.x <= -cc.winSize.width/2 + width/2) {
			this.player.x = -cc.winSize.width/2 + width/2;
		}
		if(this.player.y >= cc.winSize.height/2 - height) {
			this.player.y = cc.winSize.height/2 - height;
		}else if(this.player.y <= -cc.winSize.height/2 + height/2) {
			this.player.y = -cc.winSize.height/2 + height/2;
		}
	}

    onDestroy() {
		this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
	}
}
