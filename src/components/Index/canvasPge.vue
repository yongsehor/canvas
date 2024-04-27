<template>
  <div id="grid">
    <canvas id="canvas" width="300px" height="300px"></canvas>
  </div>
</template>
<script>
export default {
  name: "canvasPage",
  data() {
    return {
      canvas: null,
      ctx: null,
      startAngle:0,
      statusConfig: {
        IDLE: 0,
        DRAG_START: 1,//开始拖动
        DRAGGING: 2,//正在拖动
        WHEEL_START: 4,//开始旋转
        WHEELING: 5//正在旋转
      },
      canvasInfo: {
        status: 0,
        lineTarget: null,//不规则圆
        dragTarget: null,//圆圈
        wheelTarget: null,//圆点
        diameterTarget: null,//直径
        lastEvtPos: { x: null, y: null },
        offsetEvtPos: { x: null, y: null }//偏移量：拖动时防止回到圆心
      },
      circles:[],//存储画布上的圆圈
      dotCircles: [],//存储画布上的圆点
      lineCircles: [],//存储画布上的不规则圆
      diameters: [],//存储画布上的直径
      canvasWidth:0,
      canvasHeight:0,
      dotRadius:5,//所有用来控制的圆点的半径
      // 测试数据---后续通过接口数据计算出每个不规则圆的中心点画出圆圈
      cArr: [
        {
          x: 200,
          y: 200,
          r:30
        },
        {
          x: 100,
          y: 100,
          r: 10
        }
      ],
      // 测试数据---后续通过接口数据计算出每个不规则圆的中心点，再根据半径标出圆点
      dArr: [
        {
          x: 170,
          y: 200,
          r: 5,
          cr:30
        },
        {
          x: 110,
          y: 100,
          r: 5,
          cr:10
        }
      ],
      // 测试数据---后续接口返回的数据绘制不规则圆
      lArr: [
        [
          {
            x: 165,
            y: 200,
            cr:30
          },
          {
            x: 170,
            y: 185,
            cr:30
          },
          {
            x: 180,
            y: 174,
            cr:30
          },
          {
            x: 200,
            y: 155,
            cr:30
          },
          {
            x: 215,
            y: 174,
            cr:30
          },
          {
            x: 226,
            y: 180,
            cr:30
          },
          {
            x: 232,
            y: 200,
            cr:30
          },
          {
            x: 226,
            y: 220,
            cr:30
          },
          {
            x: 215,
            y: 230,
            cr:30
          },
          {
            x: 200,
            y: 233,
            cr:30
          },
          {
            x: 185,
            y: 230,
            cr:30
          },
          {
            x: 174,
            y: 220,
            cr:30
          },
          {
            x: 165,
            y: 200,
            cr:30
          }
        ],
        [
          {
            x: 90,
            y: 100,
            cr:10
          },
          {
            x: 91,
            y: 95,
            cr:10
          },
          {
            x: 95,
            y: 91,
            cr:10
          },
          {
            x: 100,
            y: 90,
            cr:10
          },
          {
            x: 105,
            y: 91,
            cr:10
          },
          {
            x: 109,
            y: 95,
            cr:10
          },
          {
            x: 110,
            y: 100,
            cr:10
          },
          {
            x: 109,
            y: 105,
            cr:10
          },
          {
            x: 105,
            y: 109,
            cr:10
          },
          {
            x: 100,
            y: 110,
            cr:10
          },
          {
            x: 95,
            y: 109,
            cr:10
          },
          {
            x: 91,
            y: 105,
            cr:10
          },
          {
            x: 90,
            y: 100,
            cr:10
          }
        ]
      ],
      //测试数据---后续接口返回的数据绘制直径
      rArr: [
        [
          {
            x: 170,
            y: 200,
            cr: 30
          },
          {
            x: 230,
            y: 200,
            cr: 30
          }
        ],
        [
          {
            x: 90,
            y: 100,
            cr: 10
          },
          {
            x: 110,
            y: 100,
            cr: 10
          }
        ]
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
    drawAll() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.circles.forEach(a => this.drawCircle(a.x, a.y, a.r));
      this.dotCircles.forEach(a => this.drawDot(a.x, a.y, a.r));
      this.diameters.forEach(a => this.drawDiameter(a));
      this.lineCircles.forEach(a => this.drawLineCircle(a));
    },
    draw() {
      this.canvasInfo.status = this.statusConfig.IDLE
      this.cArr.forEach( a => {
        this.drawCircle(a.x, a.y, a.r)
        this.circles.push(a)
      });
      this.dArr.forEach( a => {
        this.drawDot(a.x, a.y, a.r)
        this.dotCircles.push(a)
      });
      this.lArr.forEach( a => {
        this.drawLineCircle(a)
        this.lineCircles.push(a)
      });
      this.rArr.forEach( a => {
        this.drawDiameter(a)
        this.diameters.push(a)
      });
      this.canvas.addEventListener('touchstart', e=>this.touchStartEvent(e))
      this.canvas.addEventListener('touchmove', e=>this.touchMoveEvent(e))
      this.canvas.addEventListener('touchend', e=>this.touchEndEvent(e))
    },
    // 绘制大圆
    drawCircle(cx, cy, r) {
      this.ctx.save()
      this.ctx.beginPath()
      // 白色圆圈
      this.ctx.strokeStyle = "white";
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2)
      this.ctx.stroke()
      this.ctx.closePath()
      this.ctx.restore()
    },
    // 绘制不规则圆圈
    drawLineCircle(points) {
      this.ctx.save()
      this.ctx.beginPath()
      // 渐变色
      var grd = this.ctx.createLinearGradient(0, 0, 170, 0);
      grd.addColorStop("0", "black");
      grd.addColorStop("0.3", "magenta");
      grd.addColorStop("0.5", "blue");
      grd.addColorStop("0.6", "green");
      grd.addColorStop("0.8", "yellow");
      grd.addColorStop(1, "red");
      this.ctx.strokeStyle = grd;
      for (let index = 0; index < points.length; index++) {
        const ele = points[index];
        this.ctx.lineTo(ele.x,ele.y);
      }
      this.ctx.stroke()
      this.ctx.closePath()
      this.ctx.restore()
    },
    // 绘制直径
    drawDiameter(points) {
      this.ctx.save()
      this.ctx.beginPath()
      for (let index = 0; index < points.length; index++) {
        const ele = points[index];
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
    //拖动对象坐标变动
    dragChangePosition(xMove, yMove) {
      const { wheelTarget, dragTarget, lineTarget, diameterTarget } = this.canvasInfo
      lineTarget.forEach(e=>{
        e.x += xMove
        e.y += yMove
      })
      diameterTarget.forEach(e=>{
        e.x += xMove
        e.y += yMove
      })
      dragTarget.x += xMove
      dragTarget.y += yMove
      wheelTarget.x += xMove
      wheelTarget.y += yMove
    },
    //判断是否在圆内
    ifInCircle(pos){
      for (let index = 0; index < this.circles.length; index++) {
        if (this.getDistance(this.circles[index], pos) < (this.circles[index].r)) {
          return this.circles[index]
        }
      }
      return false
    },
    //判断是否在小圆点内
    ifInDotCircle(pos){
      for (let index = 0; index < this.dotCircles.length; index++) {
        if (this.getDistance(this.dotCircles[index], pos) < this.dotCircles[index].r) {
          return this.dotCircles[index]
        }
      }
      return false
    },
    // 获取触摸时的坐标
    getCanvasPosition(e){
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
    touchStartEvent(e) {
      const dotRef = this.ifInDotCircle(this.getCanvasPosition(e))
      const circleRef = this.ifInCircle(this.getCanvasPosition(e))
      if (dotRef) {
        this.getFriendByTarget(dotRef, 2)
        this.canvasInfo.wheelTarget = dotRef
        this.canvasInfo.status = this.statusConfig.WHEEL_START
        this.canvasInfo.lastEvtPos = this.getCanvasPosition(e)
        this.canvasInfo.offsetEvtPos = this.getCanvasPosition(e)
      }else if(circleRef && !dotRef){
        this.canvasInfo.dragTarget = circleRef
        this.getFriendByTarget(circleRef)
        this.canvasInfo.status = this.statusConfig.DRAG_START
        this.canvasInfo.lastEvtPos = this.getCanvasPosition(e)
        this.canvasInfo.offsetEvtPos = this.getCanvasPosition(e)
      }
    },
     // 移动
    touchMoveEvent(e) {
      if (this.canvasInfo.status === this.statusConfig.DRAG_START && this.getDistance(this.getCanvasPosition(e), this.canvasInfo.lastEvtPos) > 10) {// 开始拖动圆圈
        this.canvasInfo.status = this.statusConfig.DRAGGING
        this.canvasInfo.offsetEvtPos = this.getCanvasPosition(e)
      } else if (this.canvasInfo.status === this.statusConfig.DRAGGING) {//正在拖动圆圈
        const xMove = this.getCanvasPosition(e).x - this.canvasInfo.offsetEvtPos.x
        const yMove = this.getCanvasPosition(e).y - this.canvasInfo.offsetEvtPos.y
        // 拖动改变坐标点
        this.dragChangePosition(xMove,yMove)
        this.drawAll()
        this.canvasInfo.offsetEvtPos = this.getCanvasPosition(e)
      } else if (this.canvasInfo.status === this.statusConfig.WHEEL_START && this.getDistance(this.getCanvasPosition(e), this.canvasInfo.lastEvtPos) > 5) {//开始旋转
        this.canvasInfo.status = this.statusConfig.WHEELING
        this.canvasInfo.offsetEvtPos = this.getCanvasPosition(e)
      } else if (this.canvasInfo.status === this.statusConfig.WHEELING) {//正在旋转
        const { wheelTarget, dragTarget, lineTarget, diameterTarget } = this.canvasInfo
        const canvasPosition = this.getCanvasPosition(e)
        const angle = this.getAngle(dragTarget, wheelTarget, canvasPosition)
        if (angle) {
          let obj1 = this.rotatePoint(dragTarget.x, dragTarget.y, wheelTarget.x, wheelTarget.y, angle)
          wheelTarget.x = obj1.x
          wheelTarget.y = obj1.y
          lineTarget.forEach(ele => {
            let obj = this.rotatePoint(dragTarget.x, dragTarget.y, ele.x, ele.y, angle)
            ele.x = obj.x
            ele.y = obj.y
          })
          diameterTarget.forEach(ele => {
            let obj = this.rotatePoint(dragTarget.x, dragTarget.y, ele.x, ele.y, angle)
            ele.x = obj.x
            ele.y = obj.y
          })
          this.drawAll()
          this.canvasInfo.offsetEvtPos = this.getCanvasPosition(e)
        }
      }
    },
    // 触摸抬起
    touchEndEvent(){
      // if (this.canvasInfo.status === this.statusConfig.DRAGGING || this.canvasInfo.status === this.statusConfig.WHEELING) {
        this.canvasInfo.status = this.statusConfig.IDLE
      // }
    },
    /**
     * 根据控制对象找到伴生者
     * @param {*friendTarget}  当前控制对象
     * @param {*type} 1,当前控制对象为圆圈；2，圆点 
     */
    getFriendByTarget(friendTarget, type = 1) {
      if (type == 1) {
        this.canvasInfo.wheelTarget = this.dotCircles.filter(ele => friendTarget.r == ele.cr)[0]
        this.canvasInfo.lineTarget = this.lineCircles.filter(ele => friendTarget.r == ele[0].cr)[0]
        this.canvasInfo.diameterTarget = this.diameters.filter(ele => friendTarget.r == ele[0].cr)[0]
      } else {
        this.canvasInfo.dragTarget = this.circles.filter(ele => friendTarget.cr == ele.r)[0]
        this.canvasInfo.lineTarget = this.lineCircles.filter(ele => friendTarget.cr == ele[0].cr)[0]
        this.canvasInfo.diameterTarget = this.diameters.filter(ele => friendTarget.cr == ele[0].cr)[0]
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
      var AB = { x: B.x - A.x, y: B.y - A.y };
      var AC = { x: C.x - A.x, y: C.y - A.y };
      var dotProduct = AB.x * AC.x + AB.y * AC.y;
      var modAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
      var modAC = Math.sqrt(AC.x * AC.x + AC.y * AC.y);
      var angle = Math.acos(dotProduct / (modAB * modAC));
      return angle; 
    },
    // 计算旋转后的点的坐标
    rotatePoint(cx, cy, x, y, angle) {
      // 计算旋转后的点相对于圆心的向量
      const vx = x - cx;
      const vy = y - cy;
      let newX = null
      let newY = null
      newX = cx + (vx * Math.cos(angle) - vy * Math.sin(angle));
      newY = cy + (vx * Math.sin(angle) + vy * Math.cos(angle));
      return { x:newX, y:newY };
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