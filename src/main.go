package main

import (
	"net/http"
	"fmt"
	"os"
	"io/ioutil"
	"flag"
	url2 "net/url"
	"strings"
	"mime/multipart"
	"bytes"
	"io"
	"crypto/md5"
	"encoding/hex"
)

var (
	confFile = flag.String("confFile", "config.ini", "生成配置文件")
)

func returnRespImageSteam(url string) ([]byte, error) {
	f, err := os.Open(url)
	if err != nil {
		return nil, err
	}
	return ioutil.ReadAll(f)
}

func md5Str(str string) (string) {
	md5Ctx := md5.New()
	md5Ctx.Write([]byte(str))
	return hex.EncodeToString(md5Ctx.Sum(nil))
}

func createDevServer() {
	flag.Parse()
	http.HandleFunc("/readFile", func(writer http.ResponseWriter, request *http.Request) {
		u, _ := url2.Parse(request.RequestURI)
		q := u.Query()
		filePath := q.Get("file")
		server := q.Get("server") + "/upload.php"
		url := strings.Replace(filePath, "file:///", "", -1)
		fmt.Printf("解析文件:%s,上传到服务器:%s\n", url, server)

		//上传文件
		bf := &bytes.Buffer{}
		bw := multipart.NewWriter(bf)
		//写入图片信息
		filename := md5Str(url)
		fw, err := bw.CreateFormFile("img", filename)
		if err != nil {
			fmt.Println("Error")
			writer.Write([]byte("error"))
			return
		}
		//打开文件句柄
		fp, err := os.Open(url)
		if err != nil {
			writer.Write([]byte("file opne error"))
			return
		}
		//拷贝到输出流
		_, err = io.Copy(fw, fp)
		if err != nil {
			writer.Write([]byte("file copy error"))
			return
		}
		ct := bw.FormDataContentType()
		bw.Close()
		resp, err := http.Post(server, ct, bf)
		if err != nil {
			return
		}
		defer resp.Body.Close()
		resp_body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return
		}
		writer.Header().Set("Access-Control-Allow-Origin", "*")             //允许访问所有域
		writer.Header().Add("Access-Control-Allow-Headers", "Content-Type") //header的类型
		writer.Header().Set("content-type", "application/json")             //返回数据格式是json
		writer.Write(resp_body)
		fmt.Println(string(resp_body))
	})
	fmt.Println("插件启动成功，正在监听请求")
	http.ListenAndServe(":45452", nil)
}

/**/
func main() {
	//开启一个线程
	go createDevServer()
	fmt.Scanln()
}
