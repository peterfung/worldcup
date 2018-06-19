Page({
  data:{
    width:0,
    height:0,
    canIUse: wx.canIUse("button.open-type.getUserInfo") 
  },
  start:function(){
    wx.navigateTo({
        url: '../select/select'
    })
  },
  onLoad: function onLoad(options) {  
      var _this = this;  
      wx.getSystemInfo({  
        success: function success(res) {  
            _this.setData({  
                width: res.windowWidth,  
                height: res.windowHeight  
            });  
        }  
      });
      var schedule = getApp().globalData.schedule;
      var globalData = getApp().globalData;
      wx.getImageInfo({
        src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com/image/draw.png',
        success: function (res) {
          console.log('draw_path:',res.path)
          globalData.draw_path = res.path;
        },
        fail: function (e) {
          console.log('fail',e)
          }
      })
      wx.getImageInfo({
        src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com/fo.svg',
        success: function (res) {
          console.log('fo_path:',res.path)
          globalData.fo_path = res.path;
        },
        fail: function (e) {
          console.log('fail',e)
          }
      })
      wx.getImageInfo({
        src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com/image/winner.png',
        success: function (res) {
          console.log('winner_path:',res.path)
          globalData.winner_path = res.path;
        },
        fail: function (e) {
          console.log('fail',e)
          }
      })
      wx.getImageInfo({
        src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com/image/wcbg1.jpg',
        success: function (res) {
          console.log('wcbg_path:',res.path)
          globalData.wcbg_path = res.path;
        },
        fail: function (e) {
          console.log('fail',e)
          }
      })
      wx.getImageInfo({
        src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com/image/qrcode.jpg',
        success: function (res) {
          console.log('wcbg_path:',res.path)
          globalData.qrcode_path = res.path;
        },
        fail: function (e) {
          console.log('fail',e)
          }
      })
  },  
  onGotUserInfo: function(e) {
    const app = getApp();
    app.globalData.userInfo = e.detail.userInfo;
    console.log("userget info:",e.detail.userInfo)
    //获取头像
    if(app.globalData.userInfo && app.globalData.userInfo.avatarUrl) {
      wx.getImageInfo({
          src: app.globalData.userInfo.avatarUrl,
          success: function (res) {
            console.log('touxiang:',res)
            app.globalData.userInfo.avatarUrl = res.path;
          }
        })
  }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})