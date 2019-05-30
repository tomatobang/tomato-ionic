set -e

pwd
# 蒲公英脚本
curl --insecure https://raw.githubusercontent.com/Pgyer/TravisFile/master/pgyer_upload.sh -o pgyer_upload.sh
chmod +x pgyer_upload.sh

# 为脚本赋权
chmod 755 ./sh/*.sh
chmod 777 ./config.xml

# 安装依赖并打包
rm -f package-lock.json
npm install
ionic cordova platform rm android
ionic cordova platform add android@7.1.4 --nofetch --no-resources
ionic cordova build android --prod --release --no-resources

# 签名
cp ./sh/tomatoAndroid.jks ./platforms/android/app/build/outputs/apk/release/tomatoAndroid.jks
cd ./platforms/android/app/build/outputs/apk/release/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./tomatoAndroid.jks \
    -storepass ${TOMATO_STORE_PASS} -keypass ${TOMATO_KEY_PASS} app-release-unsigned.apk tomatoAndroid
jarsigner -verify app-release-unsigned.apk

# 压缩优化
${ANDROID_HOME}/build-tools/28.0.3/zipalign -v 4 app-release-unsigned.apk efos-release-signed.apk

# 上传至蒲公英
cd ../../../../../../../

./pgyer_upload.sh ./platforms/android/app/build/outputs/apk/release/efos-release-signed.apk ${PGYER_APIKEY}