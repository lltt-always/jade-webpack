# 前端页面webpack工程化

> jade, sass and webpack

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8880
cd 项目路径
node dev-server.js

# build for production with minification
cd 项目路径
node build.js
```

## 注意事项

- 为了使得jade中的src引用的图片能够被webpack加载解析，需按如下格式书写

```html
div
    img(src=require("./my/image.png"))
```

- 为了使sass中通过url引入的图片被webpack加载解析，需按如下格式书写

```css
background: url(../img/count_down.png) //相对路径
```
