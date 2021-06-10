import moment from 'moment'
import accounting from 'accounting'
import dayjs from 'dayjs'
import web3 from "web3";
import { create, all } from 'mathjs';

Number.prototype.noExponents = function () {
  var data = String(this).split(/[eE]/)
  if (data.length == 1) return data[0]

  var z = '',
    sign = this < 0 ? '-' : '',
    str = data[0].replace('.', ''),
    mag = Number(data[1]) + 1

  if (mag < 0) {
    z = sign + '0.'
    while (mag++) z += '0'
    return z + str.replace(/^\-/, '')
  }
  mag -= str.length
  while (mag--) z += '0'
  return str + z
}

class numbers {
  math = create(all, {
    number: 'BigNumber',
    precision: 64,
  });

  constructor() {}

  fromDayMonthYear(date) {
    let mom = moment().dayOfYear(date.day)
    mom.set('hour', date.hour)
    mom.set('year', date.year)
    return mom.format('ddd, hA')
  }

  fromSmartContractTimeToMinutes(time) {
    return dayjs.unix(time).toDate();
  }

  fromMinutesToSmartContracTime(time) {
    return time
  }

  fromHex(hex){
    return hex.toString();
  }

  toFloat(number) {
    return parseFloat(parseFloat(number).toFixed(2))
  }

  timeToSmartContractTime(time) {
    return parseInt(new Date(time).getTime() / 1000)
  }

  toDate(date) {
    let mom = moment().dayOfYear(date.day)
    mom.set('hour', date.hour)
    mom.set('year', date.year)
    return mom.unix()
  }

  toMoney(number) {
    var _0xbea8=["\x45\x55\x52","\x25\x76","\x66\x6F\x72\x6D\x61\x74\x4D\x6F\x6E\x65\x79"];return accounting[_0xbea8[2]](number,{symbol:_0xbea8[0],format:_0xbea8[1]})
  }

  formatNumber(number) {
    return accounting.formatNumber(number)
  }

  toSmartContractDecimals(value, decimals) {
    return this.math.chain(this.math.bignumber(value)).multiply(this.math.bignumber(10 ** decimals)).done().toFixed(0);
  }

  fromDecimals(value, decimals) {
    return  Number(parseFloat(value / 10 ** decimals).toPrecision(decimals)).noExponents();
  }

  fromExponential(x) {
    var _0xe3ed=["\x61\x62\x73","\x65\x2D","\x73\x70\x6C\x69\x74","\x70\x6F\x77","\x30\x2E","\x30","\x6A\x6F\x69\x6E","\x73\x75\x62\x73\x74\x72\x69\x6E\x67","\x2B"];if(Math[_0xe3ed[0]](x)< 1.0){var e=parseInt(x.toString()[_0xe3ed[2]](_0xe3ed[1])[1]);if(e){x*= Math[_0xe3ed[3]](10,e- 1);x= _0xe3ed[4]+  new Array(e)[_0xe3ed[6]](_0xe3ed[5])+ x.toString()[_0xe3ed[7]](2)}}else {var e=parseInt(x.toString()[_0xe3ed[2]](_0xe3ed[8])[1]);if(e> 20){e-= 20;x/= Math[_0xe3ed[3]](10,e);x+=  new Array(e+ 1)[_0xe3ed[6]](_0xe3ed[5])}};return x
  }

}

let Numbers = new numbers()

export default Numbers

