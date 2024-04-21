<template>
  <div>
    <!-- 头部组件 -->
    <van-nav-bar fixed placeholder :border="false" class="navbar">
      <template #left>
        <van-icon name="arrow-left" color="#fff" @click="$router.go(-1)" />
      </template>
      <template v-slot:title> 关于Yukari Music </template>
    </van-nav-bar>
    <!-- 主体内容 -->
    <div class="content">
      <div class="logo">
        <img src="../assets/images/logo.jpg" />
      </div>
      <p>这个项目是使用<b>Vue2.x</b>版本编写的</p>
      <p>使用的UI框架为<b>Vant</b></p>
      <p>接口为<b>binaryify</b>大佬的网易云接口</p>
      <p>我只实现了部份功能，作为vue框架的练手项目</p>
      <p>UI风格参照了<b>网易云音乐APP</b></p>
      <p>其他部分全部由我一个人完成</p>
      <p>希望这个项目能帮我找到<b>工作</b>趴QAQ</p>
      <p>另外，由于API为互联网资源</p>
      <p>内部实现为直接调用网易云音乐官方API</p>
      <p>避免不了BUG 但我会尽力 尽量不影响使用</p>
      <p><del>登录部份没有写过多验证，API接口限制密码错误次数</del></p>
      <p><del>因此只处理了登录成功和密码错误两种情况</del></p>
      <p>目前登录功能已经比较完善</p>
      <p>也请注意<b>账号安全</b></p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  .logo {
    margin-bottom: 10%;
    width: 100px;
    height: 100px;
    > img {
      width: inherit;
      height: inherit;
    }
  }
  > p {
    font-size: 14px;
    color: #5b5b5b;
    line-height: 30px;
  }
}
</style>