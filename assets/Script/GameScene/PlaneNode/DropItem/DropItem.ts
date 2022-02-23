// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DropItem extends cc.Component {
	@property({
		tooltip: "speed"
	})
	moveSpeed: Number = 50;
	
	onLoad() {
		// cc.log(this.node.x, this.node.y);
	}
	
	onEnable() {
		this.onMove();
	}
	
	onMove() {
		let endPoint = cc.v2(this.node.x, -cc.winSize.height/2 - this.node.height/2);
		let time = Math.abs(endPoint.y / this.moveSpeed);
		this.moveTween = cc.tween(this.node)
			.to(time, {position: endPoint})
			.call(()=>{
				this.hit();
			})
			.start();
	}
	
	reuse(dropItemPool) {
		// get 中传入的管理类实例
		this.dropItemPool = dropItemPool;
	}
	
	hit() {
		this.moveTween.stop();
		switch(this.node.group) {
			case "gold":
				this.dropItemPool.onKillDropGold(this.node);
				break;
			case "hp":
				this.dropItemPool.onKillDropHp(this.node);
				break;
			case "attack":
				this.dropItemPool.onKillDropAttack(this.node);
				break;
		}
	}
	
	onCollisionEnter(other, self) {
		if(other.node.group == "player") {
			this.hit();
		}
	}
}
