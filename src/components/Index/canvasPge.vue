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
      circles: [],
      canvasInfo: {
        status: 0,
        dragTarget: null,
        lastEvtPos: { x: null, y: null },
        offsetEvtPos: { x: null, y: null }
      }
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
      this.ctx = this.canvas.getContext('2d')
      this.drawCircles()
    },
    drawCircles() {
      this.canvasInfo.status = this.statusConfig.IDLE
      this.drawCircle(150, 150, 70)
      this.circles.push({
        x: 150,
        y: 150,
        r:70
      })
      
      this.canvas.addEventListener('mousedown', e => {
        console.log('mousedown');
        const circleRef = this.ifInCircle(this.getCanvasPostion(e))
        if (circleRef) {
          this.canvasInfo.dragTarget = circleRef
          this.canvasInfo.status = this.statusConfig.DRAG_START
          this.canvasInfo.lastEvtPos = this.getCanvasPostion(e)
        }
      })
      this.canvas.addEventListener('touchmove', e => {
        console.log('touchmove');
        if (this.canvasInfo.status === this.statusConfig.DRAG_START && this.getDistance(this.getCanvasPostion(e),this.canvasInfo.lastEvtPos) > 5) {
          console.log('try to drag');
          this.canvasInfo.status = this.statusConfig.DRAGGING
        } else if (this.canvasInfo.status === this.statusConfig.DRAGGING) {
          console.log('dragging');
        }
      })
      this.canvas.addEventListener('mouseup', e => {
        console.log('mouseup');
        if (this.canvasInfo.status === this.statusConfig.DRAG_START) {
          this.canvasInfo.status = this.statusConfig.IDLE
        }
      })
    },
    drawCircle(cx, cy, r){
      this.ctx.save()
      this.ctx.beginPath()

      this.ctx.strokeStyle = "green"
      this.ctx.linWidth = this.isHover ? 7 : 5
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2)
      this.ctx.stroke()

      this.ctx.closePath()
      this.ctx.restore()
    },
    ifInCircle(pos){
      for (let index = 0; index < this.circles.length; index++) {
        if (this.getDistance(this.circles[index], pos) < this.circles[index].r) {
          return this.circles[index]
        }
      }
      return false
    },
    getCanvasPostion(e){
      return {
        x: e.offsetX,
        y: e.offsetY
      }
    },
    getDistance(p1, p2) {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    }
  },
};
</script>

<style lang="less">
#grid{
  text-align: center;
  margin: 20px;
  #canvas{
    width: 300px;
    height: 300px;
    border: 1px solid blue;
    
  }
}
</style>