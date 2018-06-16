后台运行程序
方法1：
windows 只需要在编译的时候使用一下go build - ldflags="-H windows"

Linux  在运行程序的尾部加入&，或者nohup ./example &

方法2：
导入一个包即可。

_  "github.com/codyguo/godaemon"

使用方法：

./example -d=true 或者 ./example -d true



方法来自于：https://github.com/icattlecoder/godaemon，仅支持-d=true的参数输入方法。

http://github.com/codyguo/godaemon，支持-d=true和-d true