# 西安心理前端

基于管理系统基础框架v1.0.2，技术栈：vue2.0+cli4.0+element ui+sass...

## 项目地址

外网：
VUE_APP_BASE_URL = /mlf2024
VUE_APP_IMAGE_URL=http://xaxl.mlfworldgroup.com:30006
VUE_APP_CHART=http://47nf527nx549.vicp.fun

现场：
VUE_APP_BASE_URL = /mlf2024
VUE_APP_IMAGE_URL=http://192.168.1.251:30006
VUE_APP_CHART=http://192.168.1.250:8800

## 安装依赖

```bash
npm install
```

## 开发模式

```bash
/*默认服务方式*/
npm run serve
/*选择服务方式*/
npm run serve:ip
/*自定义服务模式*/
npm run serve -http://192.168.1.160:8080/api
```

## 编译模式

```bash
npm run build
```

## Mock模拟请求

### 新增

新增一个接口数据可以在mock-xxx.js的文件里面新增，大致格式如下代码。新增整个文件建议命名为mock-xxx.js的格式，然后再mock.js通过扩展运算符(...)
引入。

```js
{
  url:'system/login',
  response:{
    "code":1,
  }
},
//url：请求地址，response：接口返回的数据
```

### 引用

再utils有一个apiMock文件，用这个去替代api请求，如：

```js
//替换前
import axios  from "@/utils/apiCommon";
//替换后
//todo 当前采用mock进行虚拟请求，如需更换实际请求可以更换为apiCommon或其它的
import axios  from "@/utils/apiMock";
```

## 不同Node版本下的差异

### node-scss与scss-loader

| node版本   | 对应node-sass版本 | 对应sass-loader |
|----------|---------------|---------------|
| v14.15.1 | 4.14.1        | 7.3.1         |
| v16.18.0 | 6.0.1         | 10.2.0        |
|          |               |               |

vue.config.js调整

```js
 scss: {
        // sass-loader v8-，这个选项名是 "data"
        // sass-loader v8 中，这个选项名是 "prependData"
        // sass-loader v10+，这个选项名是 "additionalData"
        additionalData: `@import "@/style/variables.scss";`
      }
```
