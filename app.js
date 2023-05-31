// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  currentUser(){
    var that=this
    wx.request({
      url: 'http://localhost:8090/user/currentUser',
      header:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': wx.getStorageSync('token')
      },
      method:'POST',
      success(res){
        console.log(res)
        if(res.data.success){
          console.log("rescurrentUser",res.data)
          that.globalData.userInfo=res.data.data
          console.log("userInfo-->",that.globalData.userInfo)
        }else{
          wx.removeStorage({
            key: 'token',
          })
        }
      },
      fail(){
        console.log("失败")
      }
    })
  },
  globalData: {
    userInfo:null
  },
})
