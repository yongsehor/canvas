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
        DRAG_START: 1,//开始拖动
        DRAGGING: 2,//正在拖动
        WHEELIDLE: 3,
        WHEEL_START: 4,//开始旋转
        WHEELING: 5//正在旋转
      },
      canvasInfo: {
        status: 0,
        lineTarget: null,//不规则圆
        dragTarget: null,//圆圈
        wheelTarget: null,//圆点
        lastEvtPos: { x: null, y: null },
        offsetEvtPos: { x: null, y: null }//偏移量：拖动时防止回到圆心
      },
      circles:[],//存储画布上的圆圈
      dotCirles: [],//存储画布上的圆点
      lineCirles: [],//存储画布上的不规则圆
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
          x: 230,
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
            x: 140,
            y: 200,
            cr:30
          },
          {
            x: 174,
            y: 185,
            cr:30
          },
          {
            x: 185,
            y: 174,
            cr:30
          },
          {
            x: 200,
            y: 170,
            cr:30
          },
          {
            x: 215,
            y: 174,
            cr:30
          },
          {
            x: 226,
            y: 185,
            cr:30
          },
          {
            x: 230,
            y: 200,
            cr:30
          },
          {
            x: 226,
            y: 215,
            cr:30
          },
          {
            x: 215,
            y: 226,
            cr:30
          },
          {
            x: 200,
            y: 230,
            cr:30
          },
          {
            x: 185,
            y: 226,
            cr:30
          },
          {
            x: 174,
            y: 215,
            cr:30
          },
          {
            x: 140,
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
      this.lArr.forEach( a => {
        this.drawLineCircle(a)
        this.lineCirles.push(a)
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
      // this.ctx.strokeStyle = "white";
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2)
      this.ctx.stroke()
      this.ctx.closePath()
      this.ctx.restore()
    },
    getLinePostion(xmove,ymove){
      const { lineTarget } = this.canvasInfo
      lineTarget.forEach(e=>{
        e.x += xmove
        e.y += ymove
      })
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
        this.canvasInfo.dragTarget = circleRef
        this.canvasInfo.wheelTarget = this.getFriendByTarget(circleRef, 1,'wheel')
        this.canvasInfo.lineTarget = this.getFriendByTarget(circleRef, 1,'line')
        this.canvasInfo.status = this.statusConfig.DRAG_START
        this.canvasInfo.lastEvtPos = this.getCanvasPostion(e)
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
      if (dotRef) {
        this.canvasInfo.dragTarget = this.getFriendByTarget(dotRef, 2,'circle')
        this.canvasInfo.lineTarget = this.getFriendByTarget(dotRef, 2,'line')
        this.canvasInfo.wheelTarget = dotRef
        this.canvasInfo.status = this.statusConfig.WHEEL_START
        this.canvasInfo.lastEvtPos = this.getCanvasPostion(e)
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
    },
    /**
     * 根据控制对象找到伴生者
     * @param {*friendTarget}  当前控制对象
     * @param {*type} 1,当前控制对象为圆圈；2，圆点
     * @param {*name} 要返回的是圆圈还是圆点还是不规则圆
     */
    getFriendByTarget(friendTarget,type=1,name='') {
      switch (type) {
        case 1:
          return name == 'wheel' ? this.dotCirles.filter(ele => friendTarget.r == ele.cr)[0] : this.lineCirles.filter(ele => friendTarget.r == ele[0].cr)[0]
        case 2:
          return name == 'circle' ? this.circles.filter(ele => friendTarget.cr == ele.r)[0] : this.lineCirles.filter(ele => friendTarget.cr == ele[0].cr)[0]
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
        const { wheelTarget,dragTarget } = this.canvasInfo
        const xmove = this.getCanvasPostion(e).x - this.canvasInfo.offsetEvtPos.x
        const ymove = this.getCanvasPostion(e).y - this.canvasInfo.offsetEvtPos.y
        dragTarget.x += xmove
        dragTarget.y += ymove
        wheelTarget.x += xmove
        wheelTarget.y += ymove
        // 拖动不规则圆
        this.getLinePostion(xmove,ymove)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.circles.forEach(a => {
          this.drawCircle(a.x, a.y, a.r)
        });
        this.dotCirles.forEach(a => {
          this.drawDot(a.x, a.y, a.r)
        });
        this.lineCirles.forEach(a => {
          this.drawLineCircle(a)
        });
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.canvasInfo.status === this.statusConfig.WHEEL_START && this.getDistance(this.getCanvasPostion(e), this.canvasInfo.lastEvtPos) > 5) {//开始旋转
        this.canvasInfo.status = this.statusConfig.WHEELING
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      } else if (this.canvasInfo.status === this.statusConfig.WHEELING) {//正在旋转
        const { wheelTarget } = this.canvasInfo
        const { dragTarget } = this.canvasInfo
        const { lineTarget } = this.canvasInfo
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
        const canvasPosition = this.getCanvasPostion(e)
        const angleDot = this.getAngle(dragTarget, dotPos, canvasPosition)
        const angleLine = this.getAngle(dragTarget, wheelTarget, canvasPosition)
        this.getDotMovePosition(angleDot)
        let arr = []
        lineTarget.forEach((e,ind)=>{
          let lineR = Math.sqrt((dragTarget.x - e.x) ** 2 + (dragTarget.y - e.y) ** 2)
          console.log(e,'e');
          let obj = {x:null,y:null}
          if(canvasPosition.x == dragTarget.x){
            obj.x = dragTarget.x
          }else if(canvasPosition.x > dragTarget.x){
            obj.x = Math.cos(angleLine*Math.PI/180)*lineR + dragTarget.x
          }else{
            obj.x = dragTarget.x - Math.cos(angleLine*Math.PI/180)*lineR
          }
          if(canvasPosition.y == dragTarget.y){
            obj.y = dragTarget.y
          }else if(canvasPosition.y > dragTarget.y){
            obj.y = Math.sin(angleLine*Math.PI/180)*lineR + dragTarget.y
          }else{
            obj.y = dragTarget.y - Math.sin(angleLine*Math.PI/180)*lineR
          }
          console.log(obj,'obj');
          arr.push(obj)
        })
        console.log(arr,'arr');
        // this.getLineMovePosition(angle,this.getCanvasPostion(e))
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.circles.forEach(c=>this.drawCircle(c.x,c.y,c.r))
        this.dotCirles.forEach(c=>this.drawDot(c.x,c.y,c.r))
        this.lineCirles.forEach(a => {
          this.drawLineCircle(a)
        });
        this.canvasInfo.offsetEvtPos = this.getCanvasPostion(e)
      }
    },
    /**
     * 获取拖动后当前拖动状态的所有点的新坐标
     * @param {*} angle 旋转角度
     * @param {*} pos 当前触点坐标
     */
    getLineMovePosition(angle,pos) {
      const { dragTarget,lineTarget } = this.canvasInfo
      // const cy = this.circles.filter(e=>e.r = wheelTarget.cr)[0].y
      // const cx = this.circles.filter(e=>e.r = wheelTarget.cr)[0].x
      // if (pos.y == cy) {
      //   wheelTarget.y = dragTarget.y
      // }else if(pos.y > cy){
      //   wheelTarget.y = dragTarget.y + Math.sin(angle*Math.PI/180)*(dragTarget.r)
      // }else{
      //   wheelTarget.y = dragTarget.y - Math.sin(angle*Math.PI/180)*(dragTarget.r)
      // }
      // if (pos.x == cx) {
      //   wheelTarget.x = dragTarget.x
      // }else if(pos.x > cx){
      //   wheelTarget.x = Math.cos(angle*Math.PI/180)*(dragTarget.r) + dragTarget.x
      // }else{
      //   wheelTarget.x = dragTarget.x - Math.cos(angle*Math.PI/180)*(dragTarget.r)
      // }
      
      lineTarget.forEach(e=>{
        const lineR = Math.sqrt((dragTarget.x - e.x) ** 2 + (dragTarget.y - e.y) ** 2)
        e.x = Math.cos(angle*Math.PI/180)*lineR + dragTarget.x
        e.y = Math.sin(angle*Math.PI/180)*lineR + dragTarget.y
      })
    },
    getDotMovePosition(angle) {
      const { wheelTarget,dragTarget } = this.canvasInfo
      wheelTarget.x = Math.cos(angle*Math.PI/180)*(dragTarget.r) + dragTarget.x
      wheelTarget.y = dragTarget.y + Math.sin(angle*Math.PI/180)*(dragTarget.r)
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