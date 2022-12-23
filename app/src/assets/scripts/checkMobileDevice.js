    // const ua = navigator.userAgent.toLowerCase();
    // const isAndroid = ua.indexOf('android') > -1;
    // const isIphone = ua.indexOf('iphone') > -1;

    // if (isIphone === true) {
    //   window.location.href = 'com.alfresco.contentapp://iosamw';
    //   setTimeout(() => {
    //     console.log("iphone");
    //   }, 25);
    // } else if (isAndroid === true) {
    //   window.location.href = 'com.alfresco.content.app://androidamw';
    //   setTimeout(() => {
    //     console.log("android");
    //   }, 25);
    // }

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
     let app = {
       launchApp: function() {
         window.location.href = "intent:#Intent;scheme=androidamw;package=com.alfresco.content.app;end"; //which page to open(now from mobile, check its authorization)
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
