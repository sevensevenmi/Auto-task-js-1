/*
注册地址： http://Z2XF3U.ggg701.club?inviteCode=Z2XF3U

export xjck="" 设置ck，样子如下： （url可能也要换，）
*/
const axios = require("axios")
let result ="【香蕉视频每日任务】："
let headers ={cookie:process.env.xjck || "xxx_api_auth=6663306534383363663637323639656436643930326362663736383463316532"}function get(name, url, data) {
    return new Promise(async (resolve, reject) => {
        url = "https://3ulrp807b59vf7w3k5w9.guoguoapps.com"+ url
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
