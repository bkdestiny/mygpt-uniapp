// pages/mine/mine.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInfo: {
      code: '',
      spread_spid: 0,
      spread_code: 0
    }
  },
  //登录请求
  login(loginInfo){
    this.data.userInfo=loginInfo
    console.log("loginInfo-->",loginInfo)
    wx.request({
      url:'http://localhost:8090/user/login',
      data:{
        code:loginInfo.code,
        rawData:loginInfo.rawData,
        signature:loginInfo.signature
      },
      method:'GET',
      success(res){
        console.log("res->",res.data);
        if(res.data.success){
          wx.setStorageSync('token', res.data.data)
          app.currentUser()
          wx.redirectTo({
            url: '/pages/home/home',
          })
        }else{
          console.log("登录失败")
        }
      },
      fail(){

      }
    })
  },
  // 点击登录事件
handlerLogin(){
  let that = this
  //调用微信小程序的登录接口
 wx.login({
    success(e) {
      that.data.loginInfo.code = e.code //拿到的code存储在data中
      wx.showModal({
        title: '温馨提示',
        content: '微信授权登录后才能正常使用小程序功能',
        cancelText: '拒绝',
        confirmText: '同意',
        success( sucessInfo ) {
          //调用微信小程序的获取用户信息的接口
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
            lang: 'zh_CN',
            success(info) {
              //把获取到的信息复制到data中的loginInfo中
              that.data.loginInfo = Object.assign( that.data.loginInfo, info )
              //调用后台的接口，把所有整合的个人信息传过去
              that.login( that.data.loginInfo)
            },
            fail(e) {
              console.log('获取用户信息失败', e)
              
            }
          })
        },
        fail() {
          console.log("拒绝")
        },
        complete() {}
      })

    },
    fail(e) {
      console.log('fail', e)
      wx.showToast({
        title: '网络异常',
        duration: 2000
      })
      return
    }
  })
},
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})