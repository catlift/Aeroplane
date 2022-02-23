// 这个 椭圆移动的代码来自 https://forum.cocos.org/t/ellipse/83277

const {ccclass, property} = cc._decorator;

@ccclass
export default class UpdateRotation extends cc.Component {

	@property({
		type: cc.Node
	})
	nodes: cc.Node[] = [];
	
	@property({
		tooltip: "长轴长"
	})
	longLine: cc.Float = 100;
	
	@property({
		tooltip: "短轴长"
	})
	shortLine: cc.Float = 60;
	
	@property({
		tooltip: "中心点"
	})
	center: cc.Vec2 = cc.v2(0, 0);
	
	@property({
		tooltip: "speed"
	})
	speed: Number = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.angle = 0;
		this.initAngle();
	}

    update (dt) {
		this.angle = (this.angle+this.speed)%360
		
		for(var i=0; i<this.nodes.length; i++){
		    var child = this.nodes[i]
		    let angle = (child._angle + this.angle+360)%360
		
		    var a = angle*Math.PI/180
		    var x = child._a*Math.cos(a)+this.center.x;
		    var y = child._b*Math.sin(a)+this.center.y;
		    child.x = x;
		    child.y = y;
		    child.angle = -(360 - this.getRotation(child.position,cc.v2(x,y)) *180/ Math.PI);
		}
	}
	
	initAngle() {
		for(var i=0; i<this.nodes.length; i++){
		    var child = this.nodes[i]
		    var angle = (270-360/this.nodes.length*i+360)%360
		    child._a = this.longLine;
		    child._b = this.shortLine;
		    child._angle = angle;
		}
	}
	
	getRotation(p1, p2) {
		if(p1.fuzzyEquals(p2)){
		    return 0
		}
		if(p1.x==p2.x){
		    return p2.y > p1.y ? Math.PI/2 : Math.PI
		}
		var a = Math.abs(Math.atan((p2.y-p1.y)/(p2.x-p1.x)))
		if(p2.x < p1.x){
		    if(p2.y >p1.y){
		        a = Math.PI - a;
		    } else {
		        a = Math.PI + a;
		    }
		} else if(p2.y < p1.y){
		    a = Math.PI*2 - a
		}
		return a;
	}
}
