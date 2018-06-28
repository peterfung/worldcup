Page({
    data:{
        games:{},
        currLen:0,
        nextLen:0,
        selectResult:{},
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function onLoad(options) {
        var _this = this; 
        var schedule = getApp().globalData.schedule;
        var globalData = getApp().globalData;

        var currDate = new Date();
        var currTitle = currDate.getFullYear()+'-'+(currDate.getMonth()+1)+'-'+currDate.getDate();
        var currKey = (currDate.getMonth()+1)+''+currDate.getDate();
        // var currKey = '618';
        var currGames = [];

        var nextDate = new Date(currDate.getTime() + 24*60*60*1000);
        var nextTitle = nextDate.getFullYear()+'-'+(nextDate.getMonth()+1)+'-'+nextDate.getDate();
        var nextKey = (nextDate.getMonth()+1)+''+nextDate.getDate();
        // var nextKey = '619';
        var nextGames = [];

        var totalGames = [];

        var tmp = schedule[currKey] || [];
        var gamesCount = 0;
        for (var i = 0; i < tmp.length; i++) {
            var timeArr = tmp[i]['time'].split(':');
            if(currDate.getHours() < parseInt(timeArr)+2) {
                tmp[i]['index'] = gamesCount;
                currGames.push(tmp[i]);
                totalGames.push(tmp[i]);
                gamesCount++;
            }
        }
        var tmp = schedule[nextKey] || [];
        for(var i = 0; i< tmp.length;i++) {
            if(gamesCount < 4) {
                tmp[i]['index'] = gamesCount;
                nextGames.push(tmp[i]);
                totalGames.push(tmp[i]);
                gamesCount++;
            }
        }
        
        _this.setData({
            games:{
                currTitle:currTitle,
                currGames:currGames,
                nextTitle:nextTitle,
                nextGames:nextGames
            },
            currLen:currGames.length,
            nextLen:nextGames.length,
            totalLen:totalGames.length,
        })
        console.log('total:',totalGames)
        globalData.totalGames = totalGames;

        //获取国旗png
        var pms = [];
        for(var i = 0;i<totalGames.length;i++) {
            var home_url = totalGames[i]['home_flag'];
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
            var away_url = totalGames[i]['away_flag'];
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
            for(var i = 0;i<totalGames.length;i++) {
                globalData.totalGames[i]['home_flag_png'] = res[i*2].path;
                globalData.totalGames[i]['away_flag_png'] = res[i*2+1].path;
            }
        })

    }, 

    radioChange: function(e) {
        var _this = this;
        var totalGames = getApp().globalData.totalGames;
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        var tmp = e.detail.value.split('-');
        var modify = "selectResult."+tmp[0]+"-"+tmp[1];
        totalGames[tmp[0]]['result'] = tmp[1];
        console.log('results:',totalGames);
    },
    jump:function jump() {
        var _this = this;
        wx.navigateTo({
            url: '../share/share'
        })
    },
    back:function back() {
        wx.navigateBack({
            delta: 2
          })
    }

  })