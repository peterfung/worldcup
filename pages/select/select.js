Page({
    data:{
        currGames:[],
        currKey:"614",
        currLen:0,
        currDate:"",
        selectResult:{},
        
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function onLoad(options) {  
        var _this = this;  
        var myDate = new Date();
        var currMon = myDate.getMonth()+1;
        var currDay = myDate.getDate();
        var schedule = getApp().globalData.schedule;
        var globalData = getApp().globalData;
  
        _this.setData({
            // currKey:"617"
            currKey:currMon+""+currDay
        });
        _this.setData({
            currDate:myDate.getFullYear()+'-'+currMon+'-'+currDay,
            currGames:schedule[_this.data.currKey] || [],
            currLen:schedule[_this.data.currKey]&&schedule[_this.data.currKey]["length"] || 0
        });
        //获取国旗png
        var pms = [];
        for(var i = 0;i<_this.data.currLen;i++) {
            var home_url = schedule[_this.data.currKey][i]['home_flag'];
            home_url = home_url.replace('.svg','.png');
            pms[i*2] = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com'+home_url,
                  success: function (res) {
                    console.log(res)
                    resolve(res);
                  }
                })
              });
            var away_url = schedule[_this.data.currKey][i]['away_flag'];
            away_url = away_url.replace('.svg','.png');
            pms[i*2+1] = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: 'https://wx-1255795917.cos.ap-guangzhou.myqcloud.com'+away_url,
                  success: function (res) {
                    console.log(res)
                    resolve(res);
                  }
                })
              });
        }
        Promise.all(pms).then(res => {
            // console.log("ressss",res);
            for(var i = 0;i<_this.data.currLen;i++) {
                schedule[_this.data.currKey][i]['home_flag_png'] = res[i*2].path;
                schedule[_this.data.currKey][i]['away_flag_png'] = res[i*2+1].path;
            }
        })
    }, 

    radioChange: function(e) {
        var _this = this;
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        var tmp = e.detail.value.split('-');
        var modify = "selectResult."+tmp[0]+"-"+tmp[1];
        _this.setData({
            [modify]:tmp[2]
        })
        console.log('data:',_this.data.selectResult);
    },
    jump:function jump() {
        var _this = this;
        wx.navigateTo({
            url: '../share/share?data='+JSON.stringify(_this.data.selectResult)
        })
    },
    back:function back() {
        wx.navigateBack({
            delta: 2
          })
    }

  })