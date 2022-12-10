<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-left-center-box">
        <div class="login-left-world">
          <div class="login-title">Welcome to&nbsp<b>Admin</b></div>
          <div class="content">
            <pre ref="container" class="container" id="container"></pre>
            <pre ref="container2" ></pre>
          </div>
        </div>
      </div>
    </div>
    <div class="login-right">
      <div class="login-right-center-box">
        <div class="login-header"></div>
        <div class="login-body">
          <el-form ref="loginRef" :rules="rules">
            <el-card class="box-card">
              <div class="login-userId">
                <div>UserId</div>
                <el-form-item prop="userId">
                  <el-input class="input" v-model="data.userId" clearable placeholder="请输入账号"></el-input>
                </el-form-item>
              </div>
              <div class="login-password">
                <div>PassWord</div>
                <el-form-item prop="password">
                  <el-input class="input" type="password" show-password clearable v-model="data.userPassWorld" placeholder="请输入密码"></el-input>
                </el-form-item>
              </div>
              <div class="login-operation">
                <el-checkbox v-model="checked">记住密码</el-checkbox>
                <div><el-button type="text">忘记密码</el-button></div>
              </div>
              <div class="login-submit">
                <el-button type="primary" @click="landSubmit" class="submit-button">登陆</el-button>
              </div>
            </el-card>
          </el-form>
        </div>
        <div class="login-footer">
          <p class="login-copyright">©️ 2022 Connexial, inc, All rights reserved, | Privacy Policy</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, Ref,onMounted, toRefs} from "vue";
// let data = {
//   userId: null,
//   userPassWorld: '',
// }

const props = defineProps<{ texts: string[] }>()
const { texts } = toRefs(props)


let container = ref()
let container2 = ref()

let defaultRun: boolean = true;
let infinite: boolean = true;
let frameTime: number = 75;
let endWaitStep = 3
let prefixString = "";
let runTexts = [""];
let colorTextLength = 5;
let step = 1;
let colors = [
  "rgb(110,64,170)",
  "rgb(150,61,179)",
  "rgb(191,60,175)",
  "rgb(228,65,157)",
  "rgb(254,75,131)",
  "rgb(255,94,99)",
  "rgb(255,120,71)",
  "rgb(251,150,51)",
  "rgb(226,183,47)",
  "rgb(198,214,60)",
  "rgb(175,240,91)",
  "rgb(127,246,88)",
  "rgb(82,246,103)",
  "rgb(48,239,130)",
  "rgb(29,223,163)",
  "rgb(26,199,194)",
  "rgb(35,171,216)",
  "rgb(54,140,225)",
  "rgb(76,110,219)",
  "rgb(96,84,200)",
];
let inst = {
  text: "",
  prefix: -(prefixString.length + colorTextLength),
  skillI: 0,
  skillP: 0,
  step: step,
  direction: "forward",
  delay: endWaitStep,
};

function randomNum(minNum: number, maxNum: number): number {
  switch (arguments.length) {
    case 1:
      return parseInt((Math.random() * minNum + 1).toString(), 10);
    case 2:
      return parseInt((Math.random() * (maxNum - minNum + 1) + minNum).toString(), 10);
    default:
      return 0;
  }
}
let randomTime: number = randomNum(15, 150);
let destroyed: boolean = false;
let continue2: boolean = false;
let infinite0: boolean = true;


onMounted(() => {
  runTexts = texts.value;
  continue2 = defaultRun;
  infinite0 = infinite;
  inst.delay = endWaitStep;
  if (!infinite0) {
    if (runTexts.length > 1) {
      console.warn(
          "在设置infinite=false的情况下，仅第一个字符串生效，后续字符串不再显示。"
      );
    }
  }
  init();
})

function init(): void {
  setTimeout(() => {
    if (destroyed) {
      return;
    }
    container.value && loop();
  }, randomTime);
}

function render(dom: HTMLDivElement, t: string, ut?: string): void {
  if (inst.step) {
    inst.step--;
  } else {
    inst.step = step;
    if (inst.prefix < prefixString.length) {
      inst.prefix >= 0 &&
      (inst.text += prefixString[inst.prefix]);
      inst.prefix++;
    } else {
      switch (inst.direction) {
        case "forward":
          if (inst.skillP < t.length) {
            inst.text += t[inst.skillP];
            inst.skillP++;
          } else {
            if (inst.delay) {
              inst.delay--;
            } else {
              inst.direction = "backward";
              inst.delay = endWaitStep;
            }
          }
          break;
        case "backward":
          if (inst.skillP > 0) {
            inst.text = inst.text.slice(0, -1);
            inst.skillP--;
          } else {
            inst.skillI =
                (inst.skillI + 1) % runTexts.length;
            inst.direction = "forward";
          }
          break;
        default:
          break;
      }
    }
  }
  if (ut != null) {
    inst.text = ut.substring(0, inst.skillP);
    if (inst.skillP > ut.length) {
      inst.skillP = ut.length;
    }
  }
  dom.textContent = inst.text;
  let value;
  if (inst.prefix < prefixString.length) {
    value = Math.min(
        colorTextLength,
        colorTextLength + inst.prefix
    );
  } else {
    value = Math.min(colorTextLength, t.length - inst.skillP);
  }
  dom.appendChild(fragment(value));
}

function getNextColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getNextChar(): string {
  return String.fromCharCode(94 * Math.random() + 33);
}
function fragment(value: number): DocumentFragment {
  let f = document.createDocumentFragment();
  for (let i = 0; value > i; i++) {
    let span = document.createElement("span");
    span.textContent = getNextChar();
    span.style.color = getNextColor();
    f.appendChild(span);
  }
  return f;
}
function loop(): void {
  if (destroyed) {
    return;
  }
  setTimeout(() => {
    if (continue2 && container.value != null) {
      if (destroyed) {
        return;
      }
      let dom = container.value;
      let index = inst.skillI;
      let originText = texts.value[index];
      let currentText = runTexts[index];
      if (originText != currentText) {
        render(dom, currentText, originText);
        runTexts[index] = originText;
      } else {
        render(dom, currentText);
      }
    }
    if (infinite0) {
      loop();
    } else {
      if (inst.skillP < runTexts[0].length) {
        loop();
      }
    }
  }, frameTime);
}

const rules = {
  userId: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      pattern: /^[a-z0-9]{5,10}$/,
      message: '用户名必须是5～10个字母或数字',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      pattern: /^[a-z0-9]{6,}$/,
      message: '密码太弱了，必须是6位以上的字母或数字',
      trigger: 'blur'
    }
  ]
}

const loginRef: Ref<any> = ref(null);

let data = ref({
  userId: '',
  userPassWorld: '',
})

function landSubmit() {
  loginRef.value.validate().then(async (success: any) => {
    if (success) {
      console.log('666')
    } else {
      console.log('sb')
    }
  })
  console.log(data.value,'点击了登陆')
}

</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #EFEFEF;

  .login-left {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    height: 100vh;
    width: 50%;
    background: #061178;
    opacity: 0.9;
    overflow: hidden;

    .login-left-center-box {
      display: flex;
      align-items: flex-end;
      z-index: -1;
      width: 85%;
      height: 80%;
      background: #EFEFEF;
      opacity: 0.5;
      box-shadow: 15px 15px 25px 15px #000000;
      background-image: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fsinakd20210721s%2F699%2Fw600h899%2F20210721%2F89da-9ac9aa8e71d1c5a382378e9b322dbbfe.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673182101&t=68b67ea18bc3b305575cfbffea473c87");

      .login-left-world {
        padding: 40px;
        box-sizing: border-box;
        width: 100%;
        height: 300px;

        .login-title {
          z-index: 99;
          width: 200px;
          height: 100px;
          font-size: 80px;
          color: white;
        }

        .content {
          color: black;
          height: 100%;
          width: 100%;

        }

        .container {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          white-space: pre-wrap;
          word-wrap: break-word;
        }

      }
    }
  }

  .login-right {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    height: 100vh;
    width: 50%;
    //background: #67c23a;

    .login-right-center-box {
      box-sizing: border-box;
      width: 85%;
      height: 80%;
      box-shadow: 15px 15px 15px 15px #BEBEBE;

      .login-header {
        box-sizing: border-box;
        width: 100%;
        height: 20%;
      }

      .login-body {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 60%;
        overflow: hidden;

        .box-card {
          padding-top: 40px;
          width: 400px;
          height: 360px;

          .login-userId {
            padding: 20px;

            .input {
              margin-top: 10px;
            }
          }

          .login-password {
            padding: 0 20px;

            .input {
              margin-top: 10px;
            }
          }

          .login-operation {
            display: flex;
            justify-content: space-between;
            padding: 20px;
          }

          .login-submit {

            .submit-button {
              width: 100%;
            }
          }
        }
      }

      .login-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 20%;

        .login-copyright {
          font-size: 2px;
          color: #8B8B8B;
        }
      }
    }
  }
}
</style>