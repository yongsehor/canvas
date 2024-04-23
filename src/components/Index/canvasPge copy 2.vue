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
      isHover: false,
      canvas: null,
      ctx: null,
      statusConfig: {
        IDLE: 0,
        DRAG_START: 1,
        DRAGGING: 2
      },
      canvasInfo: {
        status: 0,
        dragTarget: null,
        lastEvtPos: { x: null, y: null },
        offsetEvtPos: { x: null, y: null }//偏移量：拖动时防止回到圆心
      },
      dotInfo: {
        status: 0,
        dragTargets: null,
        lastEvtPos: { x: null, y: null },
        offsetEvtPos: { x: null, y: null }//偏移量：拖动时防止回到圆心
      },
      circles:[
        [
          {
            x:20,
            y:100
          },
          {
            x:40,
            y:30
          },
          {
            x:100,
            y:20
          },
          {
            x:160,
            y:50
          },
          {
            x:178,
            y:100
          },
          {
            x:150,
            y:140
          },
          {
            x:100,
            y:170
          },
          {
            x:80,
            y:160
          },
          {
            x:50,
            y:140
          },
          {
            x:20,
            y:100
          }
        ]
      ],
      canvasWidth:0,
      canvasHeight:0,
      dotRadius:5,//小圆点半径
      dotCirles:[],
      dragging:false
    };
  },
  watch: {
    
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
      this.drawCircles()
    },
    drawCircles() {
      this.canvasInfo.status = this.statusConfig.IDLE
      this.dotInfo.status = this.statusConfig.IDLE
      this.circles.forEach((a,i) => {
        this.drawCircle(a)
        this.dotCirles.push({
          x:a[0].x,
          y:a[0].y,
          r:this.dotRadius
        })
      });
      this.dotCirles.forEach(a => {
        this.drawDot(a.x, a.y, a.r)
      });
      this.canvas.addEventListener('touchstart', e=>this.touchStartEvent(e))
      this.canvas.addEventListener('touchmove', e=>this.touchMoveEvent(e))
      this.canvas.addEventListener('touchend', e=>this.touchEndEvent(e))
    },
    // 绘制大圆
    drawCircle(a) {
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
      for (let index = 0; index < a.length; index++) {
        const ele = a[index];
        this.ctx.lineTo(ele.x,ele.y);
      }
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
    // 监听小圆点的触摸事件
    addDotClickEvent(e) {
      //旋转操作

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
        this.canvasInfo.dragTarget = circleRef
        this.dotInfo.dragTargets = circleRef
        this.canvasInfo.status = this.statusConfig.DRAG_START
        this.canvasInfo.lastEvtPos = this.getCanvasPostion(e)
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
      if (dotRef) {
        this.canvasInfo.dragTarget = dotRef
        this.dotInfo.dragTargets = dotRef
        this.dotInfo.status = this.statusConfig.DRAG_START
        this.dotInfo.lastEvtPos = this.getCanvasPostion(e)
        this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
    },
    // 移动
    touchMoveEvent(e){
      if (this.canvasInfo.status === this.statusConfig.DRAG_START && this.getDistance(this.getCanvasPostion(e),this.canvasInfo.lastEvtPos) > 5) {
        this.canvasInfo.status = this.statusConfig.DRAGGING
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
        // this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.canvasInfo.status === this.statusConfig.DRAGGING) {
        const {dragTarget} = this.canvasInfo
        const {dragTargets} = this.dotInfo
        dragTarget.x += this.getCanvasPostion(e).x - this.canvasInfo.offsetEvtPos.x
        dragTarget.y += this.getCanvasPostion(e).y - this.canvasInfo.offsetEvtPos.y
        // dragTargets.x += this.getCanvasPostion(e).x - this.dotInfo.offsetEvtPos.x
        // dragTargets.y += this.getCanvasPostion(e).y - this.dotInfo.offsetEvtPos.y
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.dotCirles = []
        this.circles.forEach(a => {
          this.drawCircle(a.x, a.y, a.r)
          this.dotCirles.push({
            x: a.x + a.r,
            y: a.y,
            r: this.dotRadius
          })
        });
        this.dotCirles.forEach(a => {
          this.drawDot(a.x, a.y, a.r)
        });
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
        // this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
      if (this.dotInfo.status === this.statusConfig.DRAG_START && this.getDistance(this.getCanvasPostion(e),this.dotInfo.lastEvtPos) > 5) {
        this.dragging = true
        this.dotInfo.status = this.statusConfig.DRAGGING
        this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.dotInfo.status === this.statusConfig.DRAGGING) {
        if(this.dragging){
          const dotPos = {
            x:this.circles[0].x + this.circles[0].r,
            y:this.circles[0].y
          }
          const angle = this.getAngle(this.circles[0],dotPos,this.getCanvasPostion(e))
          const { dragTargets } = this.dotInfo
          const obj = this.getDotMovePosition(this.circles[0], angle)
          this.dotCirles = []
          obj.r = this.dotRadius
          this.dotCirles.push(obj)
          dragTargets.x += this.getCanvasPostion(e).x - this.dotInfo.offsetEvtPos.x
          dragTargets.y += this.getCanvasPostion(e).y - this.dotInfo.offsetEvtPos.y
          this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
          this.circles.forEach(c=>this.drawCircle(c.x,c.y,c.r))
          this.dotCirles.forEach(c=>this.drawDot(c.x,c.y,c.r))
          this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
        }

      }
    },
    /**
     * 获取拖动后线段相交圆的交点坐标-即小圆点的坐标
     * @param {*} p1 圆心坐标
     * @param {*} angle 旋转角度
     */
    getDotMovePosition(p1,angle) {
      return {
        x:Math.cos(angle*Math.PI/180)*(p1.r) + p1.x,
        y:Math.sin(angle*Math.PI/180)*(p1.r) + p1.y
      }
    },
    // 触摸抬起
    touchEndEvent(e){
      if (this.canvasInfo.status === this.statusConfig.DRAGGING) {
        this.canvasInfo.status = this.statusConfig.IDLE
      }
      if (this.dotInfo.status === this.statusConfig.DRAGGING) {
        this.dotInfo.status = this.statusConfig.IDLE
        this.dragging = false
      }
    },
    /**
     * 计算旋转角度
     * param A 圆心坐标
     * param B 圆点坐标
     * param C 触摸点坐标
     * return 旋转夹角
     */
    getAngle(A,B,C){
      // 计算向量AB和向量BC
      var AB = { x: B.x - A.x, y: B.y - A.y };
      var AC = { x: C.x - A.x, y: C.y - A.y };
      // 计算点积
      var dotProduct = AB.x * AC.x + AB.y * AC.y;
      // 计算向量的模（长度）
      var modAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
      var modAC = Math.sqrt(AC.x * AC.x + AC.y * AC.y);
      // 计算夹角
      var angle = Math.acos(dotProduct / (modAB * modAC));
      // 转换弧度到角度
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