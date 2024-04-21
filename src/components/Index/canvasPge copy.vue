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
        DRAGGING:2
      }

      const canvasInfo = {
        status:statusConfig.IDLE
      }
      const vertice1 = [
        {x:10,y:30},
        {x:70,y:30},
        {x:40,y:30},
        {x:10,y:30}
      ]
      // const vertice2 = [
      //   {x:10,y:30},
      //   {x:70,y:30},
      //   {x:40,y:30},
      //   {x:10,y:30}
      // ]
      // const vertice3 = [
      //   {x:10,y:30},
      //   {x:70,y:30},
      //   {x:40,y:30},
      //   {x:10,y:30}
      // ]
      // const vertice4 = [
      //   {x:10,y:30},
      //   {x:70,y:30},
      //   {x:40,y:30},
      //   {x:10,y:30}
      // ]
      const vertices = []
      
      const drawVertice = (ctx, vertice) => {
        ctx.save()
        ctx.beginPath()

        ctx.strokeStyle = "green"
        vertice.forEach(function (vertex, index) {
          if (index === 0) {
            ctx.moveTo(vertex.x, vertex.y); // 移动到第一个点
          } else {
            ctx.lineTo(vertex.x, vertex.y); // 从上一个点连线到当前点
          }
        });
        ctx.closePath()
        ctx.stroke()

        ctx.restore()
      }
      drawVertice(ctx, vertice1)
      // drawVertice(ctx, 150, 150, 30)
      // drawVertice(ctx, 150, 150, 50)
      // drawVertice(ctx, 150, 150, 70)
      vertices.push({
        x: 150,
        y: 150,
        r:70
      })
      const getCanvasPostion = e => {
        return {
          x: e.offsetX,
          y:e.offsetY
        }
      }
      const ifInCircle = (pos) => {
        const getDistance = (p1, p2) => {
          return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
        }
        for (let index = 0; index < circles.length; index++) {
          if (getDistance(circles[index], pos) < circles[index].r) {
            return circles[index]
          }
        }
        return false
      }
      canvas.addEventListener('mousedown', e => {
        const canvasPosition = getCanvasPostion(e);
        const circleRef = ifInCircle(canvasPosition)

        if (circleRef) {
          console.log(circleRef);
        }
      })
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