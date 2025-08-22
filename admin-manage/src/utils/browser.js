const Browser = {
  // 下载文件 重命名文件
  // downLoad (url,filename='') {
  //   let href = Browser.replaceDomain(url);
  //   let fileName = href.split('/').slice(-1)
  //   this.courseDownload(href,filename||fileName[0])
  // },
  downLoad(url) {
    this.downLoadFile(url);
  },
  // 直接下载
  downLoadFile(url) {
    const aTag = document.createElement('a');
    const href = Browser.replaceDomain(url);
    const fileName = href.split('/').slice(-1);
    const event = new MouseEvent('click');
    aTag.download = fileName[0];
    aTag.href = href;
    aTag.dispatchEvent(event);
  },
  replaceDomain(val = '') {
    return `${window.VUE_APP_IMAGE_URL}${val}`;
  },
  getApiUrl() {
    var origin = window.location.origin;
    if (origin.indexOf('localhost') >= 0) {
      origin = 'http://wan.mlfworldgroup.com:9999';
    }
    return process.env.NODE_ENV != 'production'
      ? `${origin}`
      : `${window.VUE_APP_BASE_URL}`;
  },
  courseDownload(url, fileName) {
    this.getBlob(url, (blob) => {
      this.saveAs(blob, fileName);
    });
  },
  getBlob(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status === 200) {
        cb(xhr.response);
      }
    };
    xhr.send();
  },
  saveAs(blob, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      const body = document.querySelector('body');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.style.display = 'none';
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }
  },

  // 获取图片链接真实地址
  getFullUrl(value) {
    if (!value) {
      return '';
    }
    if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
      return value;
    } else {
      return `${window.VUE_APP_IMAGE_URL}${value}`;
    }
  },
  // 图片字符串转化,最后获取图片数组，地址改为完整链接
  getImageArr(val) {
    let imageArr = JSON.parse(val);
    imageArr = imageArr.map((v) => {
      const value = v.fileUrl;
      if (!value) {
        return '';
      }
      let url = '';
      if (value.indexOf('http') >= 0 || value.indexOf('https') >= 0) {
        url = value;
      } else {
        url = `${window.VUE_APP_IMAGE_URL}${value}`;
      }
      return {
        ...v,
        fileUrl: url
      };
    });
    return imageArr;
  }
};
export default Browser;
