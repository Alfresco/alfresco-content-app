    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf("android") > -1; // android check
    const isIphone = ua.indexOf("iphone") > -1; // ios check
    if (isIphone === true) {
    let url = window.location.href;
     let app = {
       launchApp: function() {
        window.location.href = "iosamw://"+url; //which page to open(now from mobile, check its authorization)
       },
       openWebApp: function() {
        window.location.href = "https://itunes.apple.com/us/app/appname/appid";
       }
   };
   app.launchApp();
  } else if (isAndroid === true) {
    let url  = window.location.href;
     let app = {
       launchApp: function() {
        setTimeout((event) => {
          window.location.href = "intent:///"+url+"#Intent;scheme=androidamw;package=com.alfresco.content.app.debug;end"; //which page to open(now from mobile, check its authorization)
          console.log(event);
        }, 500);
        url;
        //  setTimeout(this.openWebApp, 500);
       },
       openWebApp: function() {
         window.location.href =  "https://play.google.com/store/apps/details?id=packagename";
       }
   };
   app.launchApp();
  }else{
   //navigate to website url
  }
