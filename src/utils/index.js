import {LineBreakMode} from '@/common/js/const'
import * as CryptoJS from 'crypto-js'
import moment from 'moment'
/**
 * [Datestr 时间戳转字符串格式]
 */
export function socialDateFormat (date) {
  // 获取js 时间戳
  if(date){

  
  var time = new Date()
  time=moment(time).valueOf()
  // 去掉 js 时间戳后三位
  // return date
  // date=new Date(date).getTime()
  date=moment(new Date(date.replace(/-/g,'/'))).valueOf()
  time = parseInt((time - date) / 1000)
    // 存储转换值
  var s
  if (time < 60 * 10) { // 十分钟内
    return '刚刚'
  } else if ((time < 60 * 60) && (time >= 60 * 10)) {
    // 超过十分钟少于1小时
    s = Math.floor(time / 60)
    return s + '分钟前'
  } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
    // 超过1小时少于24小时
    s = Math.floor(time / 60 / 60)
    return s + '小时前'
  } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
    // 超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24)
    return s + '天前'
  } else {
    // 超过3天
    date = new Date(parseInt(date))
    
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    
  }}
}

/**
 *  映射tag颜色
 */
export function mapTagColor (index) {
  switch (index % 4) {
    case 0:
      return 'blue'
    case 1:
      return 'green'
    case 2:
      return 'red'
    case 3:
      return 'yellow'
  }
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

export const mixin = {
  filters: {
    // 用于映射标签颜色
    mapTagColor: function (index) {
      return mapTagColor(index)
    },
    // 用于格式化时间的过滤器
    socialDate: function (formatedDate) {
      return socialDateFormat(formatedDate)
    },
    // 去除html标签
    filterHtml: function (richText) {
      if(richText){
        return richText.replace(/<.+?>/g, '')

      }
    },
    // 用于处理行尾省略号的过滤器
    textLineBreak: function (text, maxLength, lineBreakMode) {
      if (text === undefined || text === null || text.length === 0) {
        return ''
      }
      if (lineBreakMode === null || lineBreakMode === undefined) {
        lineBreakMode = LineBreakMode.EllipsisTruncatingTail
      }
      switch (lineBreakMode) {
        case LineBreakMode.WrappingTruncatingTail:
          return text.substr(0, maxLength)
        case LineBreakMode.WrappingTruncatingHead:
          return text.substr(-maxLength)
        case LineBreakMode.EllipsisTruncatingTail:
          return text.substr(0, maxLength) + (text.length > maxLength ? '...' : '')
        case LineBreakMode.EllipsisTruncatingMiddle:
          let resultText = text.substr(0, maxLength)
          if (text.length > maxLength) {
            return resultText.substr(0, parseInt(maxLength / 2)) + '...' + resultText.substr(parseInt(maxLength / 2))
          }
          return resultText
        case LineBreakMode.EllipsisTruncatingHead:
          return (text.length > maxLength ? '...' : '') + text.substr(-maxLength)
      }
      return text
    }
  }
}
/**
 *加密处理
 */
export const encryption = (params) => {
  const {
    data,
    type,
    param
  } = params;

  let { key } = params;

  const result = JSON.parse(JSON.stringify(data));

  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele];

      key = CryptoJS.enc.Latin1.parse(key);

      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    });

  }
  return result
}

/**
 * 判断是否PC端
 */
export function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
      }
  }
  if(window.screen.width>=768){
       flag = true;
  }
  return flag;
}
