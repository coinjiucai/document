/**
 ____/\\\\\\\\\_________/\\\\\\\\\\\\\\\________/\\\\\\\\\________/\\\\\\\\\\\\_____
 ___/\\\///////\\\______\/\\\///////////_______/\\\\\\\\\\\\\_____\/\\\////////\\\___
 ___\/\\\_____\/\\\______\/\\\_________________/\\\/////////\\\____\/\\\______\//\\\__
 ____\/\\\\\\\\\\\/_______\/\\\\\\\\\\\________\/\\\_______\/\\\____\/\\\_______\/\\\__
 _____\/\\\//////\\\_______\/\\\///////_________\/\\\\\\\\\\\\\\\____\/\\\_______\/\\\__
 ______\/\\\____\//\\\______\/\\\________________\/\\\/////////\\\____\/\\\_______\/\\\__
 _______\/\\\_____\//\\\_____\/\\\________________\/\\\_______\/\\\____\/\\\_______/\\\___
 ________\/\\\______\//\\\____\/\\\\\\\\\\\\\\\____\/\\\_______\/\\\____\/\\\\\\\\\\\\/____
 _________\///________\///_____\///////////////_____\///________\///_____\////////////______
 * 这边存放的是全局的公共函数，涉及业务范畴的请不要放在这边；
 * 新增的时候请先看一下是否有已经有相识的函数，如果有请尽量使用已有的；
 * 若要新增，请描述清楚该函数的用途，以及各个参数的含义；
 * 谢谢！
 */
/**
 * 公共函数
 * @description 该文件存储非业务范畴的常用公共函数，所有函数聚合在common对象中，通过`common.xxx`的方式进行调用。
 * 需要注意的是，随着代码的复杂度增加和模块化要求，有些函数可能会被独立出去。
 * @author 赖明浩
 * @date 2021-09-01
 */
export default {
  /**
   * 数组对象数据深拷贝
   * @param obj
   * @returns {*[]}
   * @constructor
   */
  CloneDeep(obj) {
    let str, newObj = Array.isArray(obj) ? [] : {};
    if (typeof obj !== 'object') {
      return [];
    } else if (window.JSON) {
      str = JSON.stringify(obj);//系列化对象
      newObj = JSON.parse(str); //还原
    } else {
      for (let i in obj) {
        newObj[i] = typeof obj[i] === 'object' ?
          this.CloneDeepObj(obj[i]) : obj[i];
      }
    }
    return newObj;
  },
  /**
   * function类型的深拷贝
   * @param obj
   * @param sort
   * @returns {null|*[]}
   */
  CloneDeepObj(obj, sort = false) {
    //如果obj为null，那么obj.constructor会报错
    if (obj === null) {
      return null;
    }
    let newObj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
      return obj;
    } else {
      let getAttr = (obj, i, sort) => {
        return typeof obj[i] === 'object' ?
          this.CloneDeepObj(obj[i], sort) : obj[i]
      }
      if (!Array.isArray(obj)) {
        let keys = Object.keys(obj).sort();
        if (sort) {
          keys = keys.sort();
        }
        keys.forEach((i) => {
          newObj[i] = getAttr(obj, i, sort);
        })
      } else {
        for (let i in obj) {
          newObj[i] = getAttr(obj, i, sort);
        }
      }
      return newObj;
    }
  },
  /**
   * 树形结构扁平化
   * @param tree 树的数组
   * @param onlyLeaf 是否只获取叶子节点
   * @returns {*[]}
   */
  DelayeringTree(tree, onlyLeaf = false) {
    let arr = []
    for (let i of tree) {
      let item = this.CloneDeep(i)
      delete item['children']
      if ((onlyLeaf && !i.hasOwnProperty('children')) || !onlyLeaf) {
        arr.push(item)
      }
      if (i.children) {
        arr.push(...this.DelayeringTree(i.children, onlyLeaf))
      }
    }
    return arr
  },
  /**
   * 获取全部父节点
   * @param flattenList {object[]} 扁平化处理的树列表
   * @param parentValue {string | number} 当前节点的父节点的唯一标识的键值，默认id的值
   * @param key {string} 节点的唯一标识的键名，默认为id
   * @param parentKey {string} 节点的父节点的唯一标识的键名，默认为parentId
   * @returns {object[]} 父节点列表
   */
  getAllParentNodes(flattenList, parentValue, key = 'id', parentKey = 'parentId') {
    let result = [];
    if (parentValue) {
      //当前父节点
      const res = flattenList.find(val => val[key] === parentValue)
      if (res) {
        result.push(res)
        // 当res[parentKey]的值判断为false时就终止递归
        if (res.hasOwnProperty(parentKey) && res[parentKey]) {
          result.push(...this.getAllParentNodes(flattenList, res[parentKey], key, parentKey));
        }
      }
      return result
    } else {
      return []
    }
  },
  /**
   * 随机数
   */
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  /**
   * 列表排序
   * @param Arr
   * @param key
   */
  sortListByKey(Arr, key) {
    Arr = Arr.sort((start, end) => {
      if (start[key] > end[key])
        return 1;
      else if (start[key] < end[key])
        return -1;
      else
        return 0;
    })
  },

  toTree(data) {
    // 空数组
    let result = [];
    // 判断不是数组  直接返回
    if (!Array.isArray(data)) {
      return result
    }
    // 遍历  删除  children 属性  做初始化操作
    data.forEach(item => {
      delete item.children;
    });
    //  空对象
    let map = {};
    data.forEach(item => {
      map[item.id] = item;
    });

    /**
     * map对象的 键: 是每个id  值：对应的item
     * 1: {id: 1, pid: 0, name: "body"}
     * 2: {id: 2, pid: 1, name: "title"}
     * 3: {id: 3, pid: 2, name: "div"}
     */
    data.forEach(item => {
      // item.pid 为0时 返回underfined
      let parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        // 这里push的item是pid为0的数据
        result.push(item);
      }
    });
    return result;
  },
  /**
   * 数组删除元素,并返回删除元素的索引值
   * @param list {Array}
   * @param callback {*}
   * @returns {*}
   */
  remove(list, callback) {
    let index = -1
    if (typeof callback === 'function') {
      index = list.findIndex(callback);
    } else {
      index = list.findIndex(val => val === callback)
    }

    if (index > -1) {
      list.splice(index, 1);
    }
    return index
  },
  /**
   * 将数字转换为中文
   * @param num
   * @returns {string}
   */
  convertToChinaNum(num) {
    let arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];//可继续追加更高位转换值
    if (!num || isNaN(num)) {
      return "零";
    }
    let english = num.toString().split("")
    let result = "";
    for (let i = 0; i < english.length; i++) {
      let des_i = english.length - 1 - i;//倒序排列设值
      result = arr2[i] + result;
      let arr1_index = english[des_i];
      result = arr1[arr1_index] + result;
    }
    //将【零千、零百】换成【零】 【十零】换成【十】
    result = result.replace(/零([千百十])/g, '零').replace(/十零/g, '十');
    //合并中间多个零为一个零
    result = result.replace(/零+/g, '零');
    //将【零亿】换成【亿】【零万】换成【万】
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    //将【亿万】换成【亿】
    result = result.replace(/亿万/g, '亿');
    //移除末尾的零
    result = result.replace(/零+$/, '')
    //将【零一十】换成【零十】
    //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
    //将【一十】换成【十】
    result = result.replace(/^一十/g, '十');
    return result;
  },
  /**
   * 深度优先遍历
   * 树的数据遍历，并在callback中做相应的操作
   * @param {array} arr 数据
   * @param {function(object, number, object, number)} callback Function(item,index,parent,level) parent:父节点数据，item:当前节点数据，index:当前层级的序号，level：当前层级
   * @param {string} levelKey 子层的属性名，默认为 'children'
   * @param {object | null} parent 父节点信息，一开始默认为 null
   * @param {number} level 当前遍历的层级，默认从0开始
   * @return {boolean} 遍历是否中断
   * @author 赖明浩
   * @version 1.0.1
   */
  depthFirstSearch(arr, callback, levelKey = 'children', parent = null, level = 0) {
    try {
      arr.forEach((item, index) => {
        const isReturn = callback(item, index, parent, level);
        // 如果callback返回true就会终止遍历
        if (isReturn === true) throw new Error('');
        if (item[levelKey]) {
          const currentNode = JSON.parse(JSON.stringify(item))
          delete currentNode[levelKey]
          // 发现子层级终止遍历，当前层级相应的终止遍历
          const isBreak = this.depthFirstSearch(item[levelKey], callback, levelKey, currentNode, level + 1)
          if (isBreak) throw new Error('');
        }
      })
    } catch (e) {
      // 返回true表示遍历中断
      return true
    }
    // 返回false表示遍历完成未发生中断
    return false
  },
  /**
   * 深度优先遍历调整树
   * 对树进行深度优先遍历，并对每一层数据做出改变并返回整棵树
   * 原理：在callback中对数据进行调整并返回新的数据，然后通过map一层层返回，最终组合成整棵树；
   * @param {array} arr 数据
   * @param {function(object,number,object,number)} callback Function(item,index,parent,level) parent:父节点数据，item:当前节点数据，index:当前层级的序号，level：当前层级
   * @param {object} parent 父节点信息，一开始默认为null
   * @param {string} levelKey 子层的属性名，默认为 'children'
   * @param {number} level 当前遍历的层级，默认从0开始
   * @returns {array} 经过map处理后的数据
   * @author 赖明浩
   * @version 1.0.1
   */
  depthFirstSearchMap(arr, callback, parent = null, levelKey = 'children', level = 0) {
    return arr.map((item, index) => {
      item = callback(item, index, parent, level)
      if (item[levelKey]) {
        const currentNode = JSON.parse(JSON.stringify(item))
        delete currentNode[levelKey]
        item[levelKey] = this.depthFirstSearchMap(item[levelKey], callback, currentNode, levelKey, level + 1)
        item[levelKey] = item[levelKey];
        if (!item[levelKey].length) delete item[levelKey]
      }
      return item
    }).filter(i => !!i)
  },
  /**
   * 文件下载
   * @param {string} downWay url/stream
   * @param {object} params url(必传),fileName||stream(必传),fileName,fileType
   * @example downloadFile('url',{url:'http://192.168.1.100:8080/download/file.txt',...})
   * @example downloadFile('stream',{stream:...})
   * @author 赖明浩
   * @version 1.0.0
   */
  downloadFile(downWay = 'url', params) {
    //通过url下载
    if (downWay === 'url') {
      let x = new XMLHttpRequest()
      x.open('GET', params?.['url'] || '', true)
      x.responseType = 'blob'
      x.onload = function () {
        let url = window.URL.createObjectURL(x.response)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url;
        link.setAttribute('download', params?.['fileName'] || null)
        document.body.appendChild(link)
        setTimeout(() => {
          link.click()
          document.body.removeChild(link)
        }, 66)
      }
      x.send()
    }
    //文件流方式
    else if (downWay === 'stream') {
      const blob = new Blob(
        [params['stream']],
        {type: params.hasOwnProperty('fileType') ? params['type'] : ''}
      )
      const link = document.createElement('a')
      if ('download' in link) {
        link.download = params['fileName']
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      } else {
        // 兼容IE10+下载
        navigator['msSaveBlob'](blob, params['fileName'])
      }
    }
  },
  /**
   * 将值赋值到系统剪切板
   * @param value
   * @returns {Promise<Boolean>}
   */
  copyToSharePlate(value) {
    return new Promise((resolve) => {
      if (navigator.clipboard) {
        // navigator.clipboard是新版Clipboard API的一部分
        navigator.clipboard.writeText(value).then(() => {
          resolve(true)
        }, (err) => {
          console.error(err);
          resolve(false)
        })
      } else {
        // window.clipboardData是在不支持新版Clipboard API的旧版本浏览器中使用的一种API。
        window.clipboardData.setData('text', value)
        resolve(true)
      }

    })
  },
  /**
   * 校验公民身份证号-严格模式
   * @param {string} idNumber 身份证号
   * @returns {boolean} 验证成功返回true
   */
  checkIDNumberStrictly(idNumber) {
    if (idNumber.length !== 18) return false
    const idList = Array.from(idNumber)
    let testCode = 0
    const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
    const ai = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    for (let i = 0; i < 17; i++) {
      if (idList[i] < 0 || idList[i] > 9) return false
      testCode += (idList[i] - '0') * wi[i];
    }
    testCode %= 11;
    return ai[testCode] === idList[17];
  },
  /**
   * 从身份证号中解析出性别和出生日期
   * @param idCard 身份证号
   * @return {{gender: string | undefined, birthDate: string | undefined}}
   */
  parseIDNumber(idCard) {
    const result = {
      gender: undefined, // 性别
      birthDate: undefined // 出生日期
    };
    if (idCard.length === 18) {
      // 提取性别信息
      const genderCode = parseInt(idCard.charAt(16), 10);
      result.gender = genderCode % 2 === 0 ? '女' : '男';

      // 提取出生日期信息
      const year = idCard.substr(6, 4);
      const month = idCard.substr(10, 2);
      const day = idCard.substr(12, 2);
      result.birthDate = `${year}-${month}-${day}`;
    } else if (idCard.length === 15) {
      // 提取性别信息
      const genderCode = parseInt(idCard.charAt(14), 10);
      result.gender = genderCode % 2 === 0 ? '女' : '男';

      // 提取出生日期信息
      const year = '19' + idCard.substr(6, 2);
      const month = idCard.substr(8, 2);
      const day = idCard.substr(10, 2);
      result.birthDate = `${year}-${month}-${day}`;
    } else {
      throw new Error('Invalid ID card number');
    }
    return result;
  },
  /**
   * 检查是否为非自然变量（非自然变量--自定义的说法）
   * 非自然变量：undefined、null、NaN,+-Infinity（不一定完整，视情况增加）
   * @param v 传入的变量
   */
  naturalVariable(v) {
    return !(v === undefined || v === null || (typeof v === 'number' && (isNaN(v) || v === Infinity || v === -Infinity)))
  },
  /**
   * @description 生成UUID,默认不传参数时生成uuid4，也可指定长度与基数生成简单随机id
   * @param len 生成简单随机id时必传，指定长度
   * @param radix 生成简单随机id时，指定基数，默认62位
   * @returns {string} uuid
   * @example uuid()  // "FEC5D3BA-DDD0-43D8-AF7F-924BF46D0425"
   * @example uuid(8, 2)  // "01001010"
   * @example uuid(8, 10) // "47473046"
   * @example uuid(8, 16) // "098F4D35"
   */
  uuid(len = null, radix = null) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      // 简单型随机id，非uuid
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, 第四版组成结构
      let r;
      // rfc4122所需的固定字符
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      // 15位位uuid版本位，第四版即为4
      uuid[14] = '4';
      // 填写随机数据。在i==19时，根据rfc4122第4.1.5节的规则设置时钟序列的高位
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
  /**
   * 获取对象部分属性
   * @param obj 对象
   * @param keyList 要获取的属性的属性名列表
   * @param cloneDeep 是否深拷贝，默认否
   * @example partOfObject({a:0,b:1,c:2},['b',['c','d']]) => {b:1,d:2}
   * @returns {*}
   * @author 赖明浩
   */
  partOfObject(obj, keyList, cloneDeep = false) {
    try {
      const _obj = cloneDeep ? JSON.parse(JSON.stringify(obj)) : obj;
      if (Object.getPrototypeOf(obj) !== Object.prototype || !(Array.isArray(keyList))) {
        // 参数数据类型错误
        console.error(new Error('Wrong type of function parameter！'));
        return null;
      }
      return keyList.reduce((pre, cur) => {
        if (Array.isArray(cur) && cur.length >= 2) {
          pre[(cur?.[1]).toString()] = _obj?.[cur[0]];
        } else {
          pre[(cur).toString()] = _obj?.[cur];
        }
        return pre;
      }, {})
    } catch (e) {
      console.log(e);
    }
  },
  /**
   * 十进制非负整数转A-Z的26进制值
   * @param decimal 十进制非负整数
   * @returns {string} 26进制值
   */
  decimalToBase26(decimal) {
    console.log(decimal,'decimal');
    if(typeof decimal === "number" &&Number.isInteger(decimal)&&decimal >= 0) {
      let d = decimal;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";

      while (d > 0) {
        const remainder = d % 26;
        result = chars[remainder] + result;
        d = Math.floor(d / 26);
      }

      // If the result is empty (i.e., the input was 0), return 'A'
      return result || "A";
    }else{
      console.error(new Error(`decimalToBase26要求传入的是一个非负整数，但实际传入的值是 ${decimal} ，不符合要求！`));
    }
  }
}

