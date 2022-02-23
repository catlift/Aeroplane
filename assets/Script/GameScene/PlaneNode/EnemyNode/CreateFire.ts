const {ccclass, property} = cc._decorator;

import BulletPool from "../BulletPool"

@ccclass
export default class CreateFire extends BulletPool {
	
	@property({
		tooltip: "bullet parent",
		type: cc.Node
	})
	bulletParent: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		// 初始化对象池(传入数据到目标的脚本)
		this.initPool("EnemyBulletMove");
		
		// 父节点
		this.bulletParent = cc.find("Canvas/PlaneNode/EnemyBulletNode");
		
		// 根据间隔 get() 
		let _t = this;
		// 拿到 PlayerData 上的攻击力数据(attack)，绑定到 bulletParent 上面, BulletPool上设置
		// cc.log(this.node.name);
		let Attack: Number = 1;
		switch(this.node.name) {
			case "Enemy_1":
				Attack = this.node.getComponent("Enemy_1").Attack
				break;
			case "Enemy_2":
				Attack = this.node.getComponent("Enemy_2").Attack
				break;
			case "Enemy_3":
				Attack = this.node.getComponent("Enemy_3").Attack
				break;
			case "Enemy_Boss":
				Attack = this.node.getComponent("Enemy_Boss").Attack;
				break;
			
		}
		// let Attack = this.node.getComponent("Enemy_1").Attack || this.node.getComponent("Enemy_2").Attack || this.node.getComponent("Enemy_3").Attack || this.node.getComponent("Enemy_Boss").Attack;
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
	
	start() {
		
	}
	
}
