const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyPool extends cc.Component {

    @property({
		tooltip: "prefab",
		type: cc.Prefab
	})
	enemyPre: cc.Prefab = null;
	
	@property({
		tooltip: "频率(间隔)"
	})
	frequency: cc.Float = 0.5;
	
	@property({
		tooltip: "周期"
	})
	periodicity: cc.Float = 20;
	
	@property({
		tooltip: "起始创建间隔，scheduleOnce"
	})
	initTime: cc.Float = 5;
	
	@property({
		tooltip: "最大架"
	})
	maxPlane: Number = 15;
	
	@property({
		tooltip: "最小架"
	})
	minPlane: Number = 5;
	
	@property({
		tooltip: "count"
	})
	count: Number = 100;

    // LIFE-CYCLE CALLBACKS:
	
	// 初始化
	initPool(nodeScript) {
		this.enemyPool = new cc.NodePool(nodeScript);
		
		for(let i = 0; i < this.count; i++) {
			// 生成节点
			let enemy = cc.instantiate(this.enemyPre);
			// 通过 put 接口放进对象池
			this.enemyPool.put(enemy);
		}
		// cc.log("初始化成功");
	}
	
	// 从对象池中请求对象
	createEnemy(parentNode) {
		let enemy = null;
		// 通过 size 接口判断对象池中是否有空闲的对象
		if(this.enemyPool.size() > 0) {
			// 传入 manager 的实例，用于之后在子弹脚本中回收子弹
			enemy = this.enemyPool.get(this);
		}else {
			// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
			enemy = cc.instantiate(this.enemyPre);
		}
		// 初始化位置
		// let x = position.x;
		// let y = position.y;
		enemy.setPosition(0, cc.winSize.height + enemy.height);
		
		// 将生成的 enemy 加入节点树
		enemy.parent = parentNode;
		
		// 接下来就可以调用 enemy 身上的脚本进行初始化
		// enemy.getComponent('enemy_1').init();
	}
	
	// 将节点返回对象池
	onKilled(enemy) {
		// enemy 应该是一个 cc.Node
		this.enemyPool.put(enemy);
		// cc.log("回收成功");
	}
}
