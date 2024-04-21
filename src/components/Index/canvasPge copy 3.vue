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
      this.drawCircles()
    },
    drawCircles() {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      const statusConfig = {
        IDLE: 0,
        DRAG_START: 1,
        DRAGGING: 2
      }
      const canvasInfo = {
        status: statusConfig.IDLE,
        dragTarget: null,
        lastEvtPos: { x: null, y: null },
        offsetEvtPos: { x: null, y: null }
      }
      const circles = []
      const drawCircle = (cx, cy, r)=>{
        ctx.save()
        ctx.beginPath()

        ctx.strokeStyle = "green"
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()

        ctx.closePath()
        ctx.restore()
      }
      drawCircle(150, 150, 70)
      circles.push({
        x: 150,
        y: 150,
        r:70
      })
      const getCanvasPostion = e => {
        return {
          x: e.offsetX,
          y: e.offsetY
        }
      }
      const getDistance = (p1, p2) => {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
      }
      const ifInCircle = (pos) => {
        for (let index = 0; index < circles.length; index++) {
          if (getDistance(circles[index], pos) < circles[index].r) {
            return circles[index]
          }
        }
        return false
      }
      canvas.addEventListener('mousedown', e => {
        const circleRef = ifInCircle(getCanvasPostion(e))
        if (circleRef) {
          canvasInfo.dragTarget = circleRef
          canvasInfo.status = statusConfig.DRAG_START
          canvasInfo.lastEvtPos = getCanvasPostion(e)
        }
      })
      canvas.addEventListener('mousemove', e => {
        if (canvasInfo.status === statusConfig.DRAG_START && getDistance(getCanvasPostion(e),canvasInfo.lastEvtPos) > 5) {
          console.log('try to drag');
        }
      })
    },
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