/*
注册地址： 

status: unfinished

export ymck="" 设置ck，样子如下： （url可能也要换，）
*/
// curl --http2 -X GET -H "Host:rte2o2tfx2645m506rjf.mincjt.com" -H "accept-encoding:gzip" -H "cookie:SESSION=338ad288-a89b-42bd-a9d3-b29bc08467fe; SERVERID=c32f116c1172eb15f32b43367875880d|1625254061|1625253941" -H "user-agent:okhttp/3.11.0" "https://rte2o2tfx2645m506rjf.mincjt.com/ucp/task/sign?apiVersion=100&deviceModel=RMX2117&brand=realme&deviceName=RMX2117CN&serial=unknown&platform=android&s_device_id=cb7b084e33f5fe1e&version=2.2.0&_t=1625254062004"

let ck = 'cookie:SESSION=338ad288-a89b-42bd-a9d3-b29bc08467fe; SERVERID=c32f116c1172eb15f32b43367875880d|1625254061|1625253941'

const axios = require("axios")
let result ="【玉米视频每日任务】："
let headers ={cookie:process.env.ymck || ck}
function get(name, url, data) {
    return new Promise(async (resolve, reject) => {
        url = "https://rte2o2tfx2645m506rjf.mincjt.com"+ url
        data = data ? data : null
        if (data) {
            res = axios.post(url, data, {
                headers
            })
        } else {
            res = axios.get(url, {
                headers
            })
        }
        res
            .then(response => {
                if (response.data.retcode == 0) {
                    console.log(`${name}：成功`)
                    msg=name+"：成功  "
                } else {
                    msg=name + "：" + response.data.errmsg+" || "
                }
                console.log(msg)
                result += (name=="每日签到"?msg:"  ")
                resolve(response.data);
            })
            .catch(err => {
                console.log(err)
                resolve({
                    tip: err
                });
            });
    });
}

async function xjtask(){
await get("每日签到", "/ucp/task/sign")
await get("点击视频广告","/ucp/task/adviewClick")
await get("发表评论", "/comment/post", "vodid=51134&parentid=0&content=yyds")
await get("兑换会员","/ucp/vippkg/coinorder/","pkgid=1")
await get("保存二维码","/ucp/task/qrcodeSave")
let res = await get("获取视频列表","/vod/listing--0-0-1-0-0-0-0-0-1?timestamp=1618077496773&pid=&apiVersion=29&deviceModel=Redmi%20K30&brand=Redmi&deviceName=phoenix&serial=unknown&platform=android&version=3.8.3&_t=1618077496778")
let list = res.data.vodrows
 for (i=0;i<list.length;i++) 
   {
      let vodid=list[i].vodid
      console.log("视频："+vodid)
      //get("播放视频",`/vod/reqplay/${vodid}`)     
      await get("取消收藏",`/favorite/remove`,`vodid=${vodid}`)
      let data =await get("收藏",`/favorite/add`,`vodid=${vodid}`)
      if(JSON.stringify(data).match(/登录后/)){
      result+="auth已失效"
      i=100
      }
     }
let infores = await get("查询", "/ucp/task/index")
let user = infores.data.user
let info = user?`${user.nickname} || 金币：${user.goldcoin} || 会员：${user.gicon} || 尊享VIP到期时间：${user.dueday} || 邀请码：${user.uniqkey}`:infores.errmsg
result += info
console.log(info)
return result
}

xjtask()
