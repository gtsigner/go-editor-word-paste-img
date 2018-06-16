<?php
/**
 * Created by PhpStorm.
 * User: godtoy
 * Date: 2018/6/16
 * Time: 10:40
 */

define('SAVE_PATH', './photo/upload/');
define('URL_PATH', '/photo/upload/');
function uploadFile()
{
    if ($_FILES["img"]["error"] > 0) {
        return json_encode([
            'code' => 0,
            'msg' => '上传文件失败'
        ]);
    }

    $file = $_FILES['img'];
//判断文件类型
//($file["type"] == "image/png" || $file["type"] == "image/jpeg")
//判断上传文件类型为png或jpg且大小不超过1024000B
    if ($file["size"] < 1024000) {
        //防止文件名重复
        $filename = time() . $file["name"];
        //转码，把utf-8转成gb2312,返回转换后的字符串， 或者在失败时返回 FALSE。
        $filename = iconv("UTF-8", "gb2312", $filename);
        //检查文件或目录是否存在
        $filePath = SAVE_PATH . $filename;
        if (file_exists($filePath)) {
            return json_encode([
                'code' => 0,
                'msg' => '文件已经存在了'
            ]);
        } else {
            //保存文件,   move_uploaded_file 将上传的文件移动到新位置
            if (move_uploaded_file($file["tmp_name"], $filePath)) {
                return json_encode([
                    'code' => 1,
                    'msg' => '文件上传成功',
                    'data' => URL_PATH . $filename
                ]);
            }
        }
    } else {
        return json_encode([
            'code' => 0,
            'msg' => '文件已经存在了'
        ]);
    }
}

echo uploadFile();
