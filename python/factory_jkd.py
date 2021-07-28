## author:未名
## update_time:2021/7/1

import json,os
import time
import requests as rq
## 禁用警告
from requests.packages.urllib3.exceptions import InsecureRequestWarning
rq.packages.urllib3.disable_warnings(InsecureRequestWarning)

class Task:
    def __init__(self):
        self.count_time = 0 #执行时间统计
        self.notify = { #通知管理
            "type":"plusplus",
            "token":""
        }
        self.headers = { #请求头
            "User-Agent":'Dalvik/2.1.0 (Linux; U; Android 10; RMX2117 Build/QP1A.190711.020)',
            "Cookie":"",
            "Host":'www.xiaodouzhuan.cn',
            "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
            } 
        self.host = "https://www.xiaodouzhuan.cn"  #请求地址前缀
        self.body = ''
        
        print("需配置JKD_COOKIE,JKD_BODY\n检测中：")
        if "JKD_COOKIE" in os.environ:
            self.headers['Cookie'] = os.environ['JKD_COOKIE']
            print("从环境变量中加载了Cookie")
        else:
            print("麻溜取cookie去，然后export JKD_COOKIE")
            exit(0)
        if "JKD_BODY" in os.environ:
            self.body =  os.environ['JKD_BODY']
            print("从环境变量中加载了body")
        else:
            print("麻溜取body去，然后export JKD_BODY")
            exit(0)

    def getEnv(self,env):
        '''
        @params env:配置的环境变量，
        '''
        if env in os.environ:
            return os.environ[env].split('#')
        else:
            return []

    def beforeTask(self):
        '''
        每条任务执行前
        '''
        pass

    def afterTask(self):
        '''
        每条任务执行后
        '''
        pass

    def Task(self,name="签到"):
        '''
        编写一条任务 
        '''
        self.beforeTask()
        print("#### 执行任务：",name)
        res  = self.post('/jkd/newMobileMenu/infoMe.action').json()
        name = res['userinfo']['username'] + " UID:" +res['userinfo']['usercode']
        total  = res['userinfo']['infoMeSumCashItem']['value']
        rest = res['userinfo']['infoMeCurCashItem']['value']
        today = res['userinfo']['infoMeGoldItem']['value']
        print("账号：{}:\n今日收入{}金币\n余额{}元\n累计赚了{}元".format(name,today,rest,total))
        self.afterTask()

    def Timebox(self,name="定时宝箱"):
        self.beforeTask()
        print("#### 执行任务：",name)
        res  = self.post('/jkd/account/openTimeBoxAccount.action').json()
        print(res)
        if res['ret'] =='ok':
            print("开箱成功")
            self.position =  res['advertPopup']['position']
            time.sleep(2)
            self.stimulate()
        else:
            print("未到时间")
        self.afterTask()
    
    def stimulate(self, name="激励视频"):
        print("#### 执行任务：",name)
        res  = self.post('/jkd/account/openTimeBoxAccount.action').json()
        print(res)
        if res['ret'] =='ok':
            print("开箱成功")
            self.position =  res['advertPopup']['position']
            time.sleep(2)
            self.stimulate()
        else:
            print("未到时间")

    def run(self):
        '''
        任务执行列表
        '''
        self.Task()
        self.Timebox()

    def request(self):
        pass

    def get(self,url):
        return rq.get(self.host+ url, params=self.params, headers=self.header)

    def post(self,url):
        return rq.post(self.host+ url, headers=self.headers, data=self.body, verify=False)

    def logger(self):
        pass
    
    def notify(self):
        '''推送相关'''
        pass


if __name__=='__main__':
    task = Task()
    # env = task.getEnv('A')
    # print(env)
    task.run()