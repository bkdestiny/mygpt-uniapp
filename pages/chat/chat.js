

// pages/chat/chat.js
var io = require('../../js/weapp.socket.io',{
  transports: ['websocket']
}) 
var socket=null
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal:'',
    messageIndex:0,
    messages:[{'role':'system','content':'嗨！最近过得怎么样'}],
    reqChatGpt:false,
  },
  sendMessage(){
    if(app.globalData.userInfo==null){
      wx.showModal({
        title: '提示',
        content: '请先登录哦',
        complete: (res) => {
          if (res.cancel) {
            
          }
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/mine/mine',
            })
          }
        }
      })
      return;
    }
    if(this.data.inputVal.length<1){
      wx.showToast({
        title: '请输入点内容',
        duration:2000,
        icon:'none'
      })
      return;
    }
    if(this.data.reqChatGpt){
      wx.showToast({
        title: '先等等，chat老师还在措辞',
        duration:2000,
        icon:'none'
      })
      return;
    }
    this.data.reqChatGpt=true;
    this.data.messages.push({role:'user',content:this.data.inputVal})
    this.data.messages.push({role:"system",content:"请稍等..."})
    this.data.messageIndex=this.data.messages.length-1;
    socket.emit('message',this.data.inputVal);
    this.data.inputVal=''
     this.setData({
      messages:this.data.messages,
      inputVal:this.data.inputVal
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo:app.globalData.userInfo
    })
    if(!io.connected){
      socket = io('http://localhost:9092')
      socket.on('connect', () => {
        // console.log('connection created.')
      });
      socket.on('chatGptMessage', (d) => {
        if(d=="$end$"){
          this.data.messages[this.data.messageIndex].content='获取失败';
          this.setData({
            ['messages['+this.data.messageIndex+'].content']:this.data.messages[this.data.messageIndex].content
          })
        }else{
          // this.data.messages[this.data.messageIndex].content=this.data.messages[this.data.messageIndex].content+d;
          console.log(this.data.messages[this.data.messageIndex].content)
          this.data.messages[this.data.messageIndex].content=d;
          //console.log(this.data.messages[this.data.messageIndex])
          // this.setData({
          //   ['messages['+this.data.messageIndex+'].content']:this.data.messages[this.data.messageIndex].content
          // })
          this.setData({
            ['messages['+this.data.messageIndex+']']:this.data.messages[this.data.messageIndex]
          })
          }
          this.data.reqChatGpt=false;
      });     
    }  
  },
  inputVal:function(e){
    this.data.inputVal=e.detail.value
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

  },

})