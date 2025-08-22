/**
 *  这边存放的是全局的公共函数以及部分常量值，涉及业务范畴的请不要放在这边；
 *
 *  //////////////       ////////////////             ///            /////////////
 *  //            //     //                          // //           //           //
 *  //             //    //                         //   //          //            //
 *  //             //    //                        //     //         //             //
 *  //           //      //                       //       //        //             //
 *  /////////////        /////////////////       /////////////       //             //
 *  //          //       //                     //           //      //             //
 *  //           //      //                    //             //     //             //
 *  //            //     //                   //               //    //            //
 *  //             //    /////////////////   //                 //   //////////////
 */
import moment from 'moment';
let Common = {
  formatFloat(val, len) {
    let length = len === undefined ? 2 : len;
    return Number(Number(val).toFixed(length));
  },
  isShell() {
    //是否是壳
    return window.navigator.userAgent.indexOf('Electron') != -1;
  },
  /**
   * 根据数字返回周几
   * @param date
   * @returns {string}
   */
  getWeek(date) {
    // 参数时间戳
    let week = moment(date).day();
    switch (week) {
      case 1:
        return '周一';
      case 2:
        return '周二';
      case 3:
        return '周三';
      case 4:
        return '周四';
      case 5:
        return '周五';
      case 6:
        return '周六';
      case 0:
        return '周日';
    }
  },
  /**
   * 数据深拷贝,无法复制function、Infinitely、undefined
   * @param obj
   * @returns {*[]}
   * @constructor
   */
  CloneDeep(obj) {
    let str,
      newObj = Array.isArray(obj) ? [] : {};
    if (typeof obj !== 'object') {
      return;
    } else if (window.JSON) {
      (str = JSON.stringify(obj)), //系列化对象
        (newObj = JSON.parse(str)); //还原
    } else {
      for (let i in obj) {
        //todo 感觉有问题，cloneObj不存在！
        newObj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
      }
    }
    return newObj;
  },
  /**
   * 数据深拷贝，能够复制function、Infinitely、undefined
   * @param obj
   * @param sort
   * @returns {null|*}
   * @constructor
   */
  CloneDeepObj(obj, sort = false) {
    if (typeof obj !== 'object') {
      return;
    } else if (obj === null) {
      return null;
    } else {
      let newObj = obj.constructor === Array ? [] : {};
      let getAttr = (obj, i, sort) => {
        return typeof obj[i] === 'object'
          ? this.CloneDeepObj(obj[i], sort)
          : obj[i];
      };
      if (!Array.isArray(obj)) {
        let keys = Object.keys(obj).sort();
        if (sort) {
          keys = keys.sort();
        }
        keys.forEach((i) => {
          newObj[i] = getAttr(obj, i, sort);
        });
      } else {
        for (let i in obj) {
          newObj[i] = getAttr(obj, i, sort);
        }
      }
      return newObj;
    }
  },
  /**
   * 把URL的参数值转换成对象
   * @param url 0 对象 1 数组
   * @param type
   * @returns {*[]}
   */
  getParamsSet: function (url, type) {
    let SetRet = type == 0 ? [] : {};
    let sUrl = url.replace('#', '');
    if (sUrl === undefined || typeof sUrl != 'string') {
      return SetRet;
    }
    if (sUrl.indexOf('?') == -1) {
      return SetRet;
    }
    const items = decodeURI(sUrl).split('?')[1].split('&');
    for (let i = 0; i < items.length; i++) {
      let item = items[i].split('=');
      if (type == 0) {
        SetRet[item[0]] = item[1];
        //SetRet.push(item);
      } else {
        SetRet[item[0]] = item[1];
      }
    }
    return SetRet;
  },

  /**
   * 给对象增加默认属性
   * @param obj
   * @param prop
   * @param def
   */
  setProp(obj, prop, def) {
    if (!obj.hasOwnProperty(prop)) {
      obj[prop] = def;
    }
  },

  /**
   * 生成一个新ID
   * @param prefix
   * @param format
   * @param len
   * @returns {string}
   */
  getNewId(prefix = '', format = 'YYMMDDHHmmss', len = 4) {
    let bRandom = Math.random();
    while (bRandom == 0) {
      bRandom = Math.random();
    }
    let iSeed = 1;
    iSeed = 10 ** len;
    return (
      prefix +
      (moment().format(format) + Math.floor(bRandom * iSeed)).toString()
    );
  },

  /**
   * 随机生成一个key
   * @param rlen
   * @returns {string}
   */
  renderKey(rlen = 8) {
    return `${new Date().getTime()}_${Math.random()
      .toString()
      .slice(2, 2 + rlen)}`;
  },
  /**
   * 新增一个Debug
   * @param logText
   */
  addDebug(...logText) {
    if (document.querySelector('#app').__vue__.$root._ctrldown) {
      console.log(...logText);
    }
  },
  /**
   * 获取URL路径的前面部分
   * @param relation
   * @param soft_id
   * @returns {string}
   */
  getUrlBasePrefix(relation, soft_id) {
    //window.location.origin:获取 URL 的协议、主机名和端口号：
    return (
      window.location.origin +
      '/#/tabset/' +
      soft_id +
      '/' +
      relation.ui +
      '/' +
      relation.ident +
      '/'
    );
  },
  /**
   * 总秒数转为几分几秒
   * @param value
   * @returns {string}
   */
  intToMsZh: function (value) {
    let iAbsValue = Math.abs(value);
    let iMin = Math.floor(iAbsValue / 60);
    let iSec = iAbsValue % 60;
    let sRet = iMin + '分' + formatFloat(iSec) + '秒';
    if (value < 0) {
      sRet = '-' + sRet;
    }
    return sRet;
  },
  /**
   * 时间日期格式化-精确到分
   * @param val
   * @returns {string}
   */
  formatSecond(val) {
    return moment(val).format('YYYY-MM-DD HH:mm');
  },
  /**
   * 日期格式化
   * @param val
   * @returns {string}
   */
  formatMinute(val) {
    return moment(val).format('YYYY-MM-DD');
  },
  delAttr(obj, attrs) {
    let result = Object.assign({}, obj); // { ...obj }
    attrs.forEach((v, i, a) => {
      delete result[v];
    });
    return result;
  },
  /**
   * 将图片资源设为背景图
   * @param bg_pic
   * @returns {{"background-image": string}}
   */
  mgpicBackground(bg_pic) {
    return bg_pic
      ? {
          'background-image': `url(${this.mgpic(bg_pic)})`
        }
      : {};
  },
  /**
   * 将数字转换为中文方法一
   * @param num
   * @returns {string}
   */
  convertToChinaNum(num) {
    let arr1 = new Array(
      '零',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九'
    );
    let arr2 = new Array(
      '',
      '十',
      '百',
      '千',
      '万',
      '十',
      '百',
      '千',
      '亿',
      '十',
      '百',
      '千',
      '万',
      '十',
      '百',
      '千',
      '亿'
    ); //可继续追加更高位转换值
    if (!num || isNaN(num)) {
      return '零';
    }
    let english = num.toString().split('');
    let result = '';
    for (let i = 0; i < english.length; i++) {
      let des_i = english.length - 1 - i; //倒序排列设值
      result = arr2[i] + result;
      let arr1_index = english[des_i];
      result = arr1[arr1_index] + result;
    }
    //将【零千、零百】换成【零】 【十零】换成【十】
    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
    //合并中间多个零为一个零
    result = result.replace(/零+/g, '零');
    //将【零亿】换成【亿】【零万】换成【万】
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    //将【亿万】换成【亿】
    result = result.replace(/亿万/g, '亿');
    //移除末尾的零
    result = result.replace(/零+$/, '');
    //将【零一十】换成【零十】
    //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
    //将【一十】换成【十】
    result = result.replace(/^一十/g, '十');
    return result;
  },
  /**
   * 将数字转换为中文方法二
   * @param num
   * @returns {string}
   */
  toChineseNum(num) {
    //将数字装成中文的数字
    let dtext = ['', '十', '百', '千', '万'];
    let len = num.toString().length;
    let numArr = num.toString().split('');
    let numTxt = '';
    const toT = (numIndex) => {
      const arr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      return arr[numIndex];
    };
    for (let i = 1; i <= len; i++) {
      if (len > 5 && i < len - 3) {
        if (i == len - 4) {
          numTxt += numArr[i - 1] == 0 ? '' : toT(numArr[i - 1]);
          numTxt += '万';
        } else {
          if (
            (numArr[i - 2] == 0 && numArr[i - 1] == 0) ||
            (numArr[i - 1] == 0 && numArr[len - 5] == 0 && numArr[i] == 0)
          ) {
            numTxt += '';
          } else {
            numTxt +=
              (numArr[i - 1] == 0 && numArr[len - 5] != 0) ||
              (numArr[i] != 0 && numArr[i - 1] == 0)
                ? '零'
                : toT(numArr[i - 1] + dtext[len - i - 4]);
          }
        }
      } else {
        if (
          (numArr[i - 1] == 0 && i == len) ||
          (numArr[i] == 0 && numArr[i - 1] == 0)
        ) {
          numTxt += '';
        } else {
          numTxt +=
            numArr[i - 1] == 0 ? '零' : toT(numArr[i - 1]) + dtext[len - i];
        }
      }
    }
    if (numTxt.length == 3) {
      if (numTxt[0] == '一' && numTxt[1] == '十') {
        numTxt = numTxt.substr(1);
      }
    }
    return numTxt;
  },
  /**
   * 判断数组是否有重复项
   * @param arr
   * @returns {boolean}
   */
  isRepeat(arr) {
    let hash = {};
    for (let i in arr) {
      if (hash[arr[i]]) {
        return true;
      }
      hash[arr[i]] = true;
    }
    return false;
  },
  /**
   * 限制只能输入正数和0
   * @param obj
   * @param str
   * @param num
   * @param len
   */
  limitNumber(obj, str, num = 0, len = null) {
    obj[str] = obj[str].replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
    obj[str] = obj[str].replace(/^\./g, ''); //验证第一个字符是数字而不是
    obj[str] = obj[str].replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
    obj[str] = obj[str]
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    num > 0 && obj[str] > num ? (obj[str] = num) : '';
    if (len) {
      obj[str] = Number(obj[str]).toFixed(1);
    }
  },
  /**
   * 生成从minNum到maxNum的随机数
   * @param minNum
   * @param maxNum
   * @returns {number}
   */
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      default:
        return 0;
    }
  },
  /**
   * 默认的年度下拉框
   * @param moment
   * @param unlimi
   * @returns {[{label: *, value: *},{label: *, value: *},{label: *, value: *}]}
   */
  yearOption: function (moment, unlimi = false) {
    let opt = [
      {
        value: moment().subtract(1, 'year').format('YYYY'),
        label: moment().subtract(1, 'year').format('YYYY')
      },
      {
        value: moment().format('YYYY'),
        label: moment().format('YYYY')
      },
      {
        value: moment().add(1, 'year').format('YYYY'),
        label: moment().add(1, 'year').format('YYYY')
      }
    ];
    if (unlimi) {
      opt.unshift({
        value: '',
        label: '不限'
      });
    }
    return opt;
  },
  /**
   * 数组删除元素,并返回删除元素的索引值
   * @param list {Array}
   * @param callback {*}
   * @returns {*}
   */
  remove(list, callback) {
    let index = -1;
    if (typeof callback === 'function') {
      index = list.findIndex(callback);
    } else {
      index = list.findIndex((val) => val === callback);
    }

    if (index > -1) {
      list.splice(index, 1);
    }
    return index;
  },
  /**
   * 列表排序
   * @param Arr
   * @param key
   */
  sortListByKey(Arr, key) {
    Arr = Arr.sort((start, end) => {
      if (start[key] > end[key]) return 1;
      else if (start[key] < end[key]) return -1;
      else return 0;
    });
  },
  /**
   * 文件下载
   * @param downWay url/stream
   * @param params {url(必传),fileName||stream||pfCommonBlob(必传),fileName,fileType}
   */
  downloadFile(downWay = 'url', params) {
    //通过url下载
    if (downWay === 'url') blobDownload(params);
    //文件流方式
    else if (downWay === 'stream') {
      const blob = new Blob([params['stream']], {
        type: params.hasOwnProperty('fileType') ? params['type'] : ''
      });
      blobDownload(params, blob);
    }
    //Blob方式下载
    else if (downWay === 'blob') {
      axios({
        method: 'get',
        url: params['url'],
        responseType: 'blob'
      }).then((res) => {
        if (res) {
          blobDownload(params, res.data);
        }
      });
    }

    function blobDownload(_params, _blob = null) {
      const link = document.createElement('a');
      if ('download' in link) {
        link.download = _params?.['fileName'] || 'download';
        link.style.display = 'none';
        link.href = _blob ? URL.createObjectURL(_blob) : params['url'];
        document.body.appendChild(link);
        setTimeout(() => {
          link.click();
          if (_blob) URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }, 66);
      } else if (_blob) {
        // 兼容IE10+下载
        navigator['msSaveBlob'](_blob, params['fileName']);
      } else {
        throw new Error('下载失败！');
      }
    }
  },
  // 移除空childrenList属性
  removeEmptyChildrenList(data) {
    return data.map((item) => {
      // Process children recursively if they exist
      if (item.childrenList && item.childrenList.length > 0) {
        item.childrenList = Common.removeEmptyChildrenList(item.childrenList);
      } else {
        // Remove childrenList if it's [], '', or null
        delete item.childrenList;
      }
      return item;
    });
  },
  findPathById(tree, id, path = []) {
    for (const node of tree) {
      // 将当前节点ID加入路径
      const newPath = [...path, node.id];

      // 如果找到目标节点，返回当前路径
      if (node.id === id) {
        return newPath;
      }

      // 如果有子节点，递归查找
      if (node.childrenList && node.childrenList.length > 0) {
        const foundPath = Common.findPathById(node.childrenList, id, newPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }

    // 如果没有找到，返回null
    return null;
  }
};
export default Common;
