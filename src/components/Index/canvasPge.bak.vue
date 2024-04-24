<template>
  <div id="grid">
    <canvas id="canvas" width="300px" height="300px"></canvas>
  </div>
</template>
<script>
export default {
  name: "canvasPage",
  components: {

  },
  data() {
    
    return {
      canvas: null,
      ctx: null,
      statusConfig: {
        IDLE: 0,
        DRAG_START: 1,
        DRAGGING: 2,
        WHEELIDLE: 3,
        WHEEL_START: 4,
        WHEELING: 5
      },
      canvasInfo: {
        status: 0,
        dragTarget: null,
        wheelTarget: null,
        lastEvtPos: { x: null, y: null },
        offsetEvtPos: { x: null, y: null }//偏移量：拖动时防止回到圆心
      },
      circles:[],
      canvasWidth:0,
      canvasHeight:0,
      dotRadius:5,//小圆点半径
      dotCirles: [],
      // 测试数据
      cArr: [
        {
          x: 200,
          y: 200,
          r:30
        },
        {
          x: 100,
          y: 120,
          r: 15
        }
      ],
      dArr: [
        {
          x: 230,
          y: 200,
          r: 5,
          cr:30
        },
        {
          x: 115,
          y: 120,
          r: 5,
          cr:15
        }
      ]
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.canvas = document.getElementById('canvas')
      this.canvasWidth = this.canvas.getBoundingClientRect().left
      this.canvasHeight = this.canvas.getBoundingClientRect().top
      this.ctx = this.canvas.getContext('2d')
      this.draw()
    },
    draw() {
      this.canvasInfo.status = this.statusConfig.IDLE
      this.cArr.forEach( a => {
        this.drawCircle(a.x, a.y, a.r)
        this.circles.push(a)
      });
      this.dArr.forEach( a => {
        this.drawDot(a.x, a.y, a.r)
        this.dotCirles.push(a)
      });
      this.canvas.addEventListener('touchstart', e=>this.touchStartEvent(e))
      this.canvas.addEventListener('touchmove', e=>this.touchMoveEvent(e))
      this.canvas.addEventListener('touchend', e=>this.touchEndEvent(e))
    },
    // 绘制大圆
    drawCircle(cx, cy, r) {
      this.ctx.save()
      this.ctx.beginPath()
      // 渐变色圆圈
      var grd = this.ctx.createLinearGradient(0, 0, 170, 0);
      grd.addColorStop("0", "black");
      grd.addColorStop("0.3", "magenta");
      grd.addColorStop("0.5", "blue");
      grd.addColorStop("0.6", "green");
      grd.addColorStop("0.8", "yellow");
      grd.addColorStop(1, "red");
      this.ctx.strokeStyle = grd;
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2)
      this.ctx.stroke()
      this.ctx.closePath()
      this.ctx.restore()
    },
    //绘制圆上的小圆点
    drawDot(cx,cy,r) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      this.ctx.fill();
    },
    //判断是否在圆内
    ifInCircle(pos){
      for (let index = 0; index < this.circles.length; index++) {
        if (this.getDistance(this.circles[index], pos) < this.circles[index].r) {
          return this.circles[index]
        }
      }
      return false
    },
    //判断是否在小圆点内
    ifInDotCircle(pos){
      for (let index = 0; index < this.dotCirles.length; index++) {
        if (this.getDistance(this.dotCirles[index], pos) < this.dotCirles[index].r) {
          return this.dotCirles[index]
        }
      }
      return false
    },
    // 获取触摸时的坐标
    getCanvasPostion(e){
      return {
        x: e.changedTouches[0].clientX - this.canvasWidth,
        y: e.changedTouches[0].clientY - this.canvasHeight
      }
    },
    // 计算圆心坐标与触摸点坐标-是否在圆内
    getDistance(p1, p2) {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    },
    // 触摸按下
    touchStartEvent(e){
      const circleRef = this.ifInCircle(this.getCanvasPostion(e))
      const dotRef = this.ifInDotCircle(this.getCanvasPostion(e))
      if (circleRef) {
        this.canvasInfo.wheelTarget = this.getFriendByTarget(circleRef, 1)
        this.canvasInfo.dragTarget = circleRef
        this.canvasInfo.status = this.statusConfig.DRAG_START
        this.canvasInfo.lastEvtPos = this.getCanvasPostion(e)
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
      if (dotRef) {
        this.canvasInfo.dragTarget = this.getFriendByTarget(dotRef, 2)
        this.canvasInfo.wheelTarget = dotRef
        this.canvasInfo.status = this.statusConfig.WHEEL_START
        this.canvasInfo.lastEvtPos = this.getCanvasPostion(e)
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
    },
    /**
     * 根据控制对象找到伴生zhe
     * @param {*friendTarget}  当前控制对象
     * @param {*type} 1,当前控制对象为圆圈；2，圆点
     */
    getFriendByTarget(friendTarget,type=1) {
      switch (type) {
        case 1:
          return this.dotCirles.filter(ele => friendTarget.r == ele.cr)[0]
        case 2:
          return this.circles.filter(ele => friendTarget.cr == ele.r)[0]
        default:
          return null
      }
    },
    // 移动
    touchMoveEvent(e) {
      if (this.canvasInfo.status === this.statusConfig.DRAG_START && this.getDistance(this.getCanvasPostion(e), this.canvasInfo.lastEvtPos) > 5) {// 开始拖动圆圈
        this.canvasInfo.status = this.statusConfig.DRAGGING
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.canvasInfo.status === this.statusConfig.DRAGGING) {//正在拖动圆圈
        const { dragTarget } = this.canvasInfo
        const { wheelTarget } = this.canvasInfo
        dragTarget.x += this.getCanvasPostion(e).x - this.canvasInfo.offsetEvtPos.x
        dragTarget.y += this.getCanvasPostion(e).y - this.canvasInfo.offsetEvtPos.y
        wheelTarget.x += this.getCanvasPostion(e).x - this.canvasInfo.offsetEvtPos.x
        wheelTarget.y += this.getCanvasPostion(e).y - this.canvasInfo.offsetEvtPos.y
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.circles.forEach(a => {
          this.drawCircle(a.x, a.y, a.r)
        });
        this.dotCirles.forEach(a => {
          this.drawDot(a.x, a.y, a.r)
        });
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.canvasInfo.status === this.statusConfig.WHEEL_START && this.getDistance(this.getCanvasPostion(e), this.canvasInfo.lastEvtPos) > 5) {//开始旋转
        this.canvasInfo.status = this.statusConfig.WHEELING
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.canvasInfo.status === this.statusConfig.WHEELING) {//正在旋转
        const { wheelTarget } = this.canvasInfo
        const { dragTarget } = this.canvasInfo
        //处理当前状态圆圈所有点坐标旋转？？？
        let dotPos = {}
        this.circles.forEach(ele => {
          if (ele.r == wheelTarget.cr) {
            dotPos = {
              x: ele.x + ele.r,
              y: ele.y,
              r: ele.r
            }
          }
        });
        const angle = this.getAngle(dragTarget, dotPos, this.getCanvasPostion(e))
        const obj = this.getDotMovePosition(dragTarget, angle)
        wheelTarget.x = obj.x
        wheelTarget.y = obj.y
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.circles.forEach(c=>this.drawCircle(c.x,c.y,c.r))
        this.dotCirles.forEach(c=>this.drawDot(c.x,c.y,c.r))
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
    },
    /**
     * 获取拖动后线段相交圆的交点坐标-即小圆点的坐标
     * @param {*} p1 圆心坐标
     * @param {*} angle 旋转角度
     */
    getDotMovePosition(p1, angle) {
      return {
        x:Math.cos(angle*Math.PI/180)*(p1.r) + p1.x,
        y:Math.sin(angle*Math.PI/180)*(p1.r) + p1.y
      }
    },
    // 触摸抬起
    touchEndEvent(e){
      if (this.canvasInfo.status === this.statusConfig.DRAGGING || this.canvasInfo.status === this.statusConfig.WHEELING) {
        this.canvasInfo.status = this.statusConfig.IDLE
      }
    },
    /**
     * 计算旋转角度
     * param A 圆心坐标
     * param B 与圆心水平线交于圆的点坐标（这里是右边？？？）
      * param C 触摸点坐标
     * return 旋转夹角
     */
    getAngle(A,B,C){
      var AB = { x: B.x - A.x, y: B.y - A.y };
      var AC = { x: C.x - A.x, y: C.y - A.y };
      var dotProduct = AB.x * AC.x + AB.y * AC.y;
      var modAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
      var modAC = Math.sqrt(AC.x * AC.x + AC.y * AC.y);
      var angle = Math.acos(dotProduct / (modAB * modAC));
      return angle * (180 / Math.PI); 
    }
  },
  beforeDestroy() {
    this.canvas.removeEventListener('touchstart', this.touchStartEvent);
    this.canvas.removeEventListener('touchmove', this.touchMoveEvent);
    this.canvas.removeEventListener('touchend', this.touchEndEvent);
  },
};
</script>
<style lang="less">
#grid{
  // text-align: center;
  // margin: 20px;
  #canvas{
    border: 1px solid blue;
    
  }
}
</style>