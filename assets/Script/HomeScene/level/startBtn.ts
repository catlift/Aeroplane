// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class startBtn extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    // update (dt) {}
	
	onTouchStart() {
		cc.director.loadScene("GameScene");
	}
	
	onDestroy() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
	}
}
