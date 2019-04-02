# Tomatobang

> ionic/cordova version for tomatobang

### Installation

just follow these commands

```sh
$ git clone https://github.com/tomatobang/tomato-ionic
$ cd  tomato-ionic
$ npm i
```

### Services

- JPush see:https://www.jiguang.cn/
- TalkingData see: http://www.talkingdata.com/
- QiNiu see: https://www.qiniu.com

### Serve

To serve in the browser

```bash

$ ionic serve
```


now you can see tomatobang running at your browser

### Platforms

> android and ios are both supported.

to add platform

```bash

$ ionic cordova platform add android
$ ionic cordova platform add ios

```

To run

```bash

$ ionic cordova run android
$ ionic cordova run ios

```

### Build Android APK File

To build APK file to output folder

```bash
$ ionic cordova build android
```

### Hot Push

```bash
# android
$ code-push release-cordova tomatobang android
# ios
$ code-push release-cordova tomatobang ios
```

### Related Repo

- [tomato-server](https://github.com/tomatobang/tomato-server)
- [tomato-web](https://github.com/tomatobang/tomato-web)

### Collaborator

- [CShame](https://github.com/CShame)

### License

MIT@[yipeng.info](https://yipeng.info)
