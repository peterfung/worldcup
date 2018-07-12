Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //分析跳转过来的数据
    const totalGames = getApp().globalData.totalGames;
    const userInfo = getApp().globalData.userInfo;
    const globalData = getApp().globalData;
    console.log('userin ;',userInfo);
    console.log('totalGames ;',totalGames)

    //画图
      const ctx = wx.createCanvasContext('shareImg')
      //背景图
      // 
      console.log('gdfdfd',globalData.wcbg_path)
      ctx.drawImage(globalData.wcbg_path, 0, 0, 545, 771)
      // ctx.drawImage('../../image/wcbg-1.jpg', 0, 0, 545, 771)
      //头像
      if(userInfo && userInfo.avatarUrl) {
        ctx.drawImage(userInfo.avatarUrl, 545/2-35, 60, 70, 70)
      }
      ctx.setFillStyle('#ffffff')
      ctx.setTextAlign('center')
      ctx.setFontSize(30)
      if(userInfo && userInfo.nickName) {
        ctx.fillText(userInfo.nickName, 545/2, 170)
      } else {
        ctx.fillText('我', 545/2, 170)
      }
      ctx.setFontSize(26)
      ctx.fillText("对今天比赛的看法是", 545/2, 210);
      var resultCount = 0;
      for(var i = 0; i< totalGames.length; i++) {
        if(!totalGames[i]['result']) {
          continue;
        }
        ctx.drawImage(totalGames[i]['home_flag_png'], 545/2 -100, 280 + resultCount*100, 50, 50);
        ctx.drawImage(totalGames[i]['away_flag_png'], 545/2 +50, 280 + resultCount*100, 50, 50);
        ctx.setFontSize(24)
        ctx.setTextAlign('right')
        ctx.fillText(totalGames[i]['home'], 545/2 -120, 312 + resultCount*100)
        ctx.setTextAlign('left')
        ctx.fillText(totalGames[i]['away'], 545/2 +120, 312 + resultCount*100)
        
        if('flat' == totalGames[i]['result']) {//平手
          ctx.drawImage(globalData.draw_path, 545/2 -40, 285 + resultCount*100, 80, 40);
          ctx.setTextAlign('center')
          ctx.setFontSize(20)
          ctx.fillText('平局', 545/2, 308 + resultCount*100)
        } else if('home' == totalGames[i]['result']) {
          ctx.drawImage(globalData.lwinner_path, 545/2 -155, 258 + resultCount*100, 60, 50);
          ctx.setFontSize(18)
          ctx.setTextAlign('center')
          ctx.fillText('WIN', 545/2-132, 280 + resultCount*100)
          ctx.setFontSize(24)
          ctx.fillText('VS', 545/2, 312 + resultCount*100)
        } else if('away' == totalGames[i]['result']) {
          ctx.drawImage(globalData.rwinner_path, 545/2 +92, 258 + resultCount*100, 60, 50);
          ctx.setFontSize(18)
          ctx.setTextAlign('center')
          ctx.fillText('WIN', 545/2+126, 280 + resultCount*100)
          ctx.setFontSize(24)
          ctx.fillText('VS', 545/2, 312 + resultCount*100)
        }
        resultCount++;
      }
      if(0 == resultCount) {
        ctx.setTextAlign('center');
        ctx.setFontSize(40);
        ctx.fillText('不能多说，', 545/2, 300);
        ctx.fillText('会泄露天机', 545/2, 400);
        ctx.fillText('...', 545/2, 500);
      }
      // ctx.drawImage(globalData.qrcode_path, 545-100, 670, 80, 80)
      ctx.stroke()
      ctx.draw(false, function (e) {
        console.log('draw callback')
        self.share();
      })
  },


 /**
  * 生成分享图
 */
  share: function () {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 771,
      destWidth: 545,
      destHeight: 771,
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 保存到相册
  */
  save: function () {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
              wx.navigateBack({
                delta: 2
              })
              
            }
          }
        })
      },
      fail: function (res) {
        console.log(res);
        if (res.errMsg.indexOf("auth") != -1) {
          console.log("打开设置窗口");
        }
      }
    })
    
  }
})