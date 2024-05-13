<template>
  <div id="login">
    <div class="logo">
      <van-image
        :src="require('../assets/images/logo.jpg')"
      />
    </div>
    <div class="button">
      <van-button type="default" block round @click="showLoginPopup">
        登 录
      </van-button>
      <van-button type="default" block round @click="showRegisterPopup">
        注 册
      </van-button>
    </div>

    <!-- 登录 -->
    <van-popup v-model="loginPopup" position="top" class="popup_login" closeable>
      <div class="form">
        <!-- 文字描述 -->
        <div class="slogen">
          <p class="slg_title">
            帐号登录<br />
          </p>
          <p class="slg_txt">
            xxxxxxxxxxxxxxxxxxx
          </p>
          <p class="slg_txt">
            <span class="slg_txt_tips">
              tips:
              密码为xxxxxxxxxxx!
            </span>
          </p>
        </div>
        <!-- 表单 -->
        <div class="text_input">
          <van-form @submit="login">
            <van-field
              v-model="phone"
              name="phone"
              label="手机号"
              placeholder="手机号"
              :rules="[
                { required: true, pattern, message: '请填写正确的手机号' },
              ]"
            />
            <van-field
              v-model="password"
              type="password"
              name="password"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div class="loginbtn">
              <van-button round block type="danger" native-type="submit">
                登 录
              </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
    <!-- 注册 -->
    <van-popup v-model="registerPopup" position="top" class="popup_login" closeable>
      <div class="form">
        <!-- 文字描述 -->
        <div class="slogen">
          <p class="slg_title">
            帐号注册<br />
          </p>
          <p class="slg_txt">
            xxxxxxxxxxxxxxxxxxx
          </p>
          <p class="slg_txt">
            <span class="slg_txt_tips">
              tips:
              密码为xxxxxxxxxxx!
            </span>
          </p>
        </div>
        <!-- 表单 -->
        <div class="text_input">
          <van-form @submit="registerSubmit">
            <van-field
              v-model="phone"
              name="phone"
              label="手机号"
              placeholder="手机号"
              :rules="[
                { required: true, pattern, message: '请填写正确的手机号' },
              ]"
            />
            <van-cell title="密码"/>
            <van-password-input
              :value="password"
              :mask="maskShow"
              @click="maskShow = !maskShow"
              :focused="showKeyboard"
              :rules="[{ required: true, message: '请填写密码' }]"
            /> 
            <van-cell title="确认密码"/>
            <van-password-input
              :value="passwordConfirm"
              :mask="maskShow1"
              @click="maskShow1 = !maskShow1"
              :focused="showKeyboard1"
              :rules="[{ required: true, message: '请再次确认密码是否一致' }]"
            /> 
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { _login,_register } from "../network/user.js";
export default {
  data() {
    return {
      loginPopup: false,
      registerPopup: false,
      maskShow:true,
      phone: "",
      password: "",
      passwordConfirm: "",
      pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    };
  },
  methods: {
    showLoginPopup() {
      this.loginPopup = true;
    },
    showRegisterPopup() {
      this.registerPopup = true;
    },
    // 登录
    async login() {
      let { data: res } = await _login(this.phone, this.password);
      if (res.code == 200) {
        window.localStorage.setItem("token", res.token);
        window.localStorage.setItem("userinfo", JSON.stringify(res.profile));
        this.$msg.success("登录成功");
        this.$router.push("/index");
      } else {
        this.$msg.fail(res.msg);
      }
    },
    // 注册
    async registerSubmit() {
      let { data: res } = await _register(this.phone, this.password);
      if (res.code == 200) {
        window.localStorage.setItem("token", res.token);
        window.localStorage.setItem("userinfo", JSON.stringify(res.profile));
        this.$msg.success("登录成功");
        this.$router.push("/index");
      } else {
        this.$msg.fail(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
#login {
  width: 100%;
  height: 100%;
  background-color: #ec4141;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .logo {
    width: 100%;
    height: 50%;
    text-align: center;
    font-size: 56px;
    color: #fff;
  }
  .button {
    width: 80%;
    > button {
      margin: 20px 0;
    }
  }
  .popup_login {
    height: 100%;
    width: 100%;
  }
  div.form {
    margin-top: 60px;
    .slogen {
      margin-left: 16px;
      color: #6c6c6c;
      .slg_title {
        font-size: 24px;
        line-height: 32px;
        > span {
          font-size: 18px;
        }
      }
      .slg_txt {
        margin-top: 18px;
        font-size: 14px;
      }
      .slg_txt_tips {
        color: red;
        font-size: 12px;
      }
    }
    .text_input {
      margin-top: 40px;
    }
    .loginbtn {
      margin: 16px;
    }
  }
}
</style>