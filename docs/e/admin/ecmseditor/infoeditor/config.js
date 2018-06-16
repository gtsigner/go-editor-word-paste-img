function EcmsEditorDoCKhtml(htmlstr) {
    if (htmlstr.indexOf('"') != -1) {
        return '';
    }
    if (htmlstr.indexOf("'") != -1) {
        return '';
    }
    if (htmlstr.indexOf("/") != -1) {
        return '';
    }
    if (htmlstr.indexOf("\\") != -1) {
        return '';
    }
    if (htmlstr.indexOf("[") != -1) {
        return '';
    }
    if (htmlstr.indexOf("]") != -1) {
        return '';
    }
    if (htmlstr.indexOf(":") != -1) {
        return '';
    }
    if (htmlstr.indexOf("%") != -1) {
        return '';
    }
    if (htmlstr.indexOf("<") != -1) {
        return '';
    }
    if (htmlstr.indexOf(">") != -1) {
        return '';
    }
    return htmlstr;
}

function EcmsEditorGetCs() {
    var js = document.getElementsByTagName("script");
    for (var i = 0; i < js.length; i++) {
        if (js[i].src.indexOf("ckeditor.js") >= 0) {
            var arraytemp = new Array();
            arraytemp = js[i].src.split('?');
            return arraytemp;
        }
    }
}

var arraycs = new Array();
arraycs = EcmsEditorGetCs();

arraycs[0] = arraycs[0].replace('infoeditor/ckeditor.js', '');

arraycs[1] = document.getElementById('doecmseditor_eaddcs').value;
arraycs[1] = EcmsEditorDoCKhtml(arraycs[1]);


CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';

    config.filebrowserImageUploadUrl = '';
    config.filebrowserFlashUploadUrl = arraycs[0];
    config.filebrowserImageBrowseUrl = arraycs[1];
    config.filebrowserFlashBrowseUrl = arraycs[1];

    config.enterMode = CKEDITOR.ENTER_BR;
    config.shiftEnterMode = CKEDITOR.ENTER_P;

    config.allowedContent = true;

    config.font_names = '宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;微软雅黑/微软雅黑;' + config.font_names;

    // Toolbar
    config.toolbar_full = [
        {name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', 'Preview', 'Print']},
        {
            name: 'clipboard',
            groups: ['clipboard', 'undo'],
            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
        },

        {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
        },
        '/',
        {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup'],
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat', 'ecleanalltext', 'autoformat']
        },

        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {
            name: 'insert',
            items: ['Image', 'etranmore', 'Flash', 'etranmedia', 'etranfile', '-', 'Table', 'HorizontalRule', 'SpecialChar', 'equotetext', 'einserttime', 'einsertpage', 'einsertbr']
        },
        '/',
        {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
        {name: 'colors', items: ['TextColor', 'BGColor']},
        {name: 'tools', items: ['ShowBlocks', 'NewPage', 'Templates']},
        {name: 'others', items: ['-']},
        {
            name: 'editing',
            groups: ['find', 'selection', 'spellchecker'],
            items: ['Find', 'Replace', '-', 'SelectAll', 'Maximize']
        }
    ];


    // Toolbar
    config.toolbar_basic = [
        {name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source']},
        {
            name: 'clipboard',
            groups: ['clipboard', 'undo'],
            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
        },
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']},
        {name: 'tools', items: ['Maximize']},
        {name: 'others', items: ['-']},
        '/',
        {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup'],
            items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']
        },
        {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
        },
        {name: 'styles', items: ['Styles', 'Format']}
    ];


    config.extraPlugins = 'etranfile,etranmedia,etranmore,autoformat,ecleanalltext,einsertbr,einsertpage,einserttime,equotetext';


    config.toolbar = 'full';


};

/*自动检测数据*/
function uplaodImage() {
    var serv = document.location.origin;
    var uploadSer = '//127.0.0.1:45452/readFile';

    //字符改变的时候
    CKEDITOR.instances.newstext.on('change', function (e) {
        var a = e.editor.document;
        var b = a.find("img");
        var count = b.count();
        for (var i = 0; i < count; i++) {
            var src = b.getItem(i).$.src;//获取img的src
            src = src.replace(/file:\/\/\//g, '');
            var url = uploadSer + '?server=' + serv + '&file=' + src;
            (function (url, ins) {
                MyAjax({
                    type: "GET",
                    url: url,
                    //async: false,//同步，因为修改编辑器内容的时候会多次调用change方法，所以要同步，否则会多次调用后台
                    success: (res) => {
                        res = JSON.parse(res);
                        if (res.code === 1) {
                            var imgUrl = serv + res.data;
                            ins.setAttribute('src', imgUrl);
                            ins.setAttribute('data-cke-saved-src', imgUrl);
                        }
                        console.log("替换字符成功")
                    }
                });
            })(url, b.getItem(i).$);
        }
    });
    //粘贴
    CKEDITOR.instances.newstext.on('paste', function (e) {

    });
}

window.onload = function () {
    function ajax() {
        var ajaxData = {
            type: arguments[0].type || "GET",
            url: arguments[0].url || "",
            async: arguments[0].async || "true",
            data: arguments[0].data || null,
            dataType: arguments[0].dataType || "text",
            contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
            beforeSend: arguments[0].beforeSend || function () {
            },
            success: arguments[0].success || function () {
            },
            error: arguments[0].error || function () {
            }
        }
        ajaxData.beforeSend()
        var xhr = createxmlHttpRequest();
        xhr.responseType = ajaxData.dataType;
        xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
        xhr.setRequestHeader("Content-Type", ajaxData.contentType);
        xhr.send(convertData(ajaxData.data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    ajaxData.success(xhr.response)
                } else {
                    ajaxData.error()
                }
            }
        }
    }

    function createxmlHttpRequest() {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }

    function convertData(data) {
        if (typeof data === 'object') {
            var convertResult = "";
            for (var c in data) {
                convertResult += c + "=" + data[c] + "&";
            }
            convertResult = convertResult.substring(0, convertResult.length - 1)
            return convertResult;
        } else {
            return data;
        }
    }

    window.MyAjax = ajax;
    setTimeout(uplaodImage, 400);
}