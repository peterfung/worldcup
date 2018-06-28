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
  onShow: function() {
    console.log('onShow');
    var globalData = getApp().globalData;
    var len = globalData.totalGames&&globalData.totalGames.length || 0;
    for(var i = 0; i< len;i++) {
        var tmp = globalData.totalGames&&globalData.totalGames[i];
        if(tmp && tmp['result']) {
            tmp['result'] = '';
        }
    }
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
      globalData.totalGames = [];
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
        src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com/image/winner.png',
        success: function (res) {
          console.log('winner_path:',res.path)
          globalData.rwinner_path = res.path;
        },
        fail: function (e) {
          console.log('fail',e)
          }
      })
      wx.getImageInfo({
        src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com/image/winner_left.png',
        success: function (res) {
          console.log('winner_path:',res.path)
          globalData.lwinner_path = res.path;
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
  onUnload:function(){
    // 页面关闭
  }
})