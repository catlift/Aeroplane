const {ccclass, property} = cc._decorator;

import EnemyPool from "./EnemyPool"

@ccclass
export default class CreateEnemy extends EnemyPool {
	

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		
	}
	
	start() {
		// 初始化对象池(传入数据到目标的脚本)
		switch(this.enemyPre.name) {
			case "Enemy_1":
				this.initPool("Enemy_1");
				break;
			case "Enemy_2":
				this.initPool("Enemy_2");
				break;
			case "Enemy_3":
				this.initPool("Enemy_3");
				break;
			case "Enemy_Boss":
				this.initPool("Enemy_Boss");
				break;
		}
		
		// 根据间隔 get()
		let _t = this;
		if(this.periodicity && this.frequency) {
			// 随机架, Math.ceil() 向上取整
			let random = Math.ceil(Math.random() * this.maxPlane);
			if(random <= this.minPlane) {
				random = this.minPlane;
			}
			// 为了缓解刚开始飞机创建太久的尴尬场面
			if(this.initTime) {
				this.scheduleOnce(function() {
					_t.schedule(function() {
						_t.createEnemy(_t.node);
						// cc.log("2");
					}, _t.frequency, random - 1);
					// cc.log('1')
				}, this.initTime);
			}
			// 根据时间间隔来生成
			this.schedule(function() {
				_t.schedule(function() {
					_t.createEnemy(_t.node);
				}, _t.frequency, random);
			}, this.periodicity);
		}else {
			// 随机架
			let random = Math.floor(Math.random() * 15);
			if(random <= 5) {
				random = 5;
			}
			// 为了缓解开始没有飞机的尴尬场面
			this.scheduleOnce(function() {
				_t.schedule(function() {
					_t.createEnemy(_t.node);
				}, 1, random);
			}, 5);
			// 根据时间间隔来生成
			this.schedule(function() {
				_t.schedule(function() {
					_t.createEnemy(_t.node);
				}, 1, random);
			}, 30);
		}
	}

    // update (dt) {}
}
