const {ccclass, property} = cc._decorator;

import BulletPool from "../BulletPool"

@ccclass
export default class BulletFire extends BulletPool {
	
	@property({
		tooltip: "bullet parent",
		type: cc.Node
	})
	bulletParent: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		
	}
	
	start() {
		// 初始化对象池(传入数据到目标的脚本)
		this.initPool("PlayerBulletMove");
		
		// 根据间隔 get() 
		let _t = this;
		// 拿到 PlayerData 上的攻击力数据(attack)，绑定到 bulletParent 上面, BulletPool上设置
		let Attack = this.node.getComponent("PlayerData").Attack;
		if(this.frequency) {
			// 根据时间间隔来生成
			this.schedule(function() {
				_t.createBullet(_t.bulletParent, _t.node.getPosition(), Attack);
			}, this.frequency);
		}else {
			cc.log("Your frequency is empty and I will set the default to 0.1");
			this.schedule(function() {
				_t.createBullet(_t.bulletParent, _t.node.getPosition(), Attack);
			}, 0.1);
		}
	}
}
