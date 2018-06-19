Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //分析跳转过来的数据
    const schedule = getApp().globalData.schedule;
    const userInfo = getApp().globalData.userInfo;
    const globalData = getApp().globalData;
    console.log('userin ;',userInfo)
    var jumpData = options.data || '{}';
    var jumpJson = JSON.parse(jumpData);
    var resultArr = [];
    var currDate = '0';
    for(var idx in jumpJson) {
      var tmp = idx.split('-');
      currDate = tmp[0];
      var tmpOne = {
        game:tmp[1],
        result:jumpJson[idx]
      };
      resultArr.push(tmpOne);
    }
    var currGames = schedule[currDate];
    //画图
      const ctx = wx.createCanvasContext('shareImg')
      //背景图
      // 
      console.log('gdfdfd',globalData.wcbg_path)
      ctx.drawImage(globalData.wcbg_path, 0, 0, 545, 771)
      // ctx.drawImage('../../image/ss.png', 0, 0, 545, 771)
      //头像
      if(userInfo && userInfo.avatarUrl) {
        ctx.drawImage(userInfo.avatarUrl, 545/2-35, 50, 70, 70)
      }
      ctx.setFillStyle('#ffffff')
      ctx.setTextAlign('center')
      ctx.setFontSize(30)
      if(userInfo && userInfo.nickName) {
        ctx.fillText(userInfo.nickName, 545/2, 170)
      } else {
        ctx.fillText('我', 545/2, 170)
      }
      
      ctx.fillText("对今天比赛的看法是", 545/2, 210)
      if(0 == resultArr.length) {
        // ctx.drawImage(globalData.fo_path, 545/2 -105, 360, 200, 200);
        ctx.setTextAlign('center')
        ctx.setFontSize(40)
        var r = Math.floor(Math.random()*3+1)
        if(1 == r) {
          ctx.fillText('不能多说，', 545/2, 300)
          ctx.fillText('会泄露天机', 545/2, 400)
          ctx.fillText('...', 545/2, 500)
        } else if(2 == r) {
          ctx.fillText('好好看球，', 545/2, 300)
          ctx.fillText('猜什么比分', 545/2, 400)
          ctx.fillText('...', 545/2, 500)
        } else if(3 == r) {
          ctx.fillText('这场比赛，', 545/2, 300)
          ctx.fillText('扑朔迷离啊', 545/2, 400)
          ctx.fillText('...', 545/2, 500)
        }
        
      } else {
        for(var i = 0; i< resultArr.length; i++) {
          console.log('resultArr',resultArr[i]['game']);

          ctx.drawImage(currGames[resultArr[i]['game']]['home_flag_png'], 545/2 -100, 280 + i*100, 50, 50);
          ctx.drawImage(currGames[resultArr[i]['game']]['away_flag_png'], 545/2 +50, 280 + i*100, 50, 50);
          ctx.setFontSize(24)
          ctx.setTextAlign('right')
          ctx.fillText(currGames[resultArr[i]['game']]['home'], 545/2 -120, 312 + i*100)
          ctx.setTextAlign('left')
          ctx.fillText(currGames[resultArr[i]['game']]['away'], 545/2 +120, 312 + i*100)
          
          if('flat' == resultArr[i]['result']) {//平手
            ctx.drawImage(globalData.draw_path, 545/2 -40, 285 + i*100, 80, 40);
            ctx.setTextAlign('center')
            ctx.setFontSize(20)
            ctx.fillText('平局', 545/2, 308 + i*100)
          } else if(currGames[resultArr[i]['game']]['home'] == resultArr[i]['result']) {
            ctx.drawImage(globalData.winner_path, 545/2 -220, 267 + i*100, 60, 50);
            ctx.setFontSize(18)
            ctx.setTextAlign('center')
            ctx.fillText('WIN', 545/2-184, 290 + i*100)
            ctx.setFontSize(24)
            ctx.fillText('VS', 545/2, 312 + i*100)
          } else if(currGames[resultArr[i]['game']]['away'] == resultArr[i]['result']) {
            ctx.drawImage(globalData.winner_path, 545/2 +190, 267 + i*100, 60, 50);
            ctx.setFontSize(18)
            ctx.setTextAlign('center')
            ctx.fillText('WIN', 545/2+222, 290 + i*100)
            ctx.setFontSize(24)
            ctx.fillText('VS', 545/2, 312 + i*100)
          }
          
        }
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
        console.log(res)
      }
    })
    
  }
})