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
        {
          x:200,
          y:200,
          r:50
        }
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
      this.circles.forEach(a => {
        this.drawCircle(a.x, a.y, a.r)
        this.dotCirles.push({
          x:a.x+a.r,
          y:a.y,
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
      this.ctx.linWidth = this.isHover ? 7 : 5
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
        this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.canvasInfo.status === this.statusConfig.DRAGGING) {
        const {dragTarget} = this.canvasInfo
        const {dragTargets} = this.dotInfo
        dragTarget.x += this.getCanvasPostion(e).x - this.canvasInfo.offsetEvtPos.x
        dragTarget.y += this.getCanvasPostion(e).y - this.canvasInfo.offsetEvtPos.y
        dragTargets.x += this.getCanvasPostion(e).x - this.dotInfo.offsetEvtPos.x
        dragTargets.y += this.getCanvasPostion(e).y - this.dotInfo.offsetEvtPos.y
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
        this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
      if (this.dotInfo.status === this.statusConfig.DRAG_START && this.getDistance(this.getCanvasPostion(e),this.dotInfo.lastEvtPos) > 5) {
        this.dragging = true
        this.dotInfo.status = this.statusConfig.DRAGGING
        this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.dotInfo.status === this.statusConfig.DRAGGING) {
        console.log('wheeling');
        
        // this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        // this.circles.forEach(c=>this.drawCircle(c.x,c.y,c.r))
        // this.dotCirles.forEach(c=>this.drawDot(c.x,c.y,c.r))
        // this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
        if(this.dragging){
          const angle = this.getAngle(this.getCanvasPostion(e),this.circles[0],this.dotCirles[0])
          console.log(angle, 'angle');
          const { dragTargets } = this.dotInfo
          const obj = this.getDotMovePosition(this.getCanvasPostion(e), this.circles[0], angle)
          console.log(obj,'obj');
          dragTargets.x += this.getCanvasPostion(e).x - this.dotInfo.offsetEvtPos.x
          dragTargets.y += this.getCanvasPostion(e).y - this.dotInfo.offsetEvtPos.y
          this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
          this.circles.forEach(c=>this.drawCircle(c.x,c.y,c.r))
          this.dotCirles.forEach(c=>this.drawDot(c.x,c.y,c.r))
          this.dotInfo.offsetEvtPos = this.getCanvasPostion(e)
          // if(angle){
          //   this.ctx.rotate(angle);
          // }
          // draw();rotaterotate
        }

      }
    },
    /**
     * 获取拖动后线段相交圆的交点坐标-即小圆点的坐标
     * @param {*} p1 拖动点坐标
     * @param {*} p2 圆心坐标
     * @param {*} angle 旋转角度
     */
    getDotMovePosition(p1,p2,angle) {
      return {
        x:Math.cos(angle)*(p1.x-p2.x) - Math.sin(angle)*(p1.y-p2.y) + p2.x,
        y:Math.cos(angle)*(p1.y-p2.y) + Math.sin(angle)*(p1.x-p2.x) + p2.y
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
    //计算中旋转角度
    getAngle(A,B,C){
      // 计算向量AB和向量BC
      var AB = { x: B.x - A.x, y: B.y - A.y };
      var BC = { x: C.x - B.x, y: C.y - B.y };
  
      // 计算点积
      var dotProduct = AB.x * BC.x + AB.y * BC.y;
  
      // 计算向量的模（长度）
      var modAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
      var modBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);
  
      // 计算夹角
      var angle = Math.acos(dotProduct / (modAB * modBC));
  
      return angle * (180 / Math.PI); // 转换弧度到角度
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