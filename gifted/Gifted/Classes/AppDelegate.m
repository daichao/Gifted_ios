/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  Gifted
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//
#import "AppDelegate.h"
#import "MainViewController.h"
#import "RCIMClient.h"
#import <Cordova/CDVPlugin.h>
// production
#define kAppId           @"pXw9qqsCH68RAt51uNZnC"
#define kAppKey          @"VQlaMuGwjQ7559eacS4tq9"
#define kAppSecret       @"ui13FhD7yU9hHvKL5CVTN"
#define kAppJSHref       @"alert(1)"

@implementation AppDelegate

@synthesize window=_window;
@synthesize viewController=_viewController;

@synthesize gexinPusher = _gexinPusher;
@synthesize appKey = _appKey;
@synthesize appSecret = _appSecret;
@synthesize appID = _appID;
@synthesize clientId = _clientId;
@synthesize sdkStatus = _sdkStatus;
@synthesize lastPayloadIndex = _lastPaylodIndex;
@synthesize payloadId = _payloadId;
@synthesize realPath = _realPath;

- (void)dealloc
{
    [_deviceToken release];
    
    [_window release];
    [_viewController release];
    [_naviController release];
    
    [_gexinPusher release];
    [_appKey release];
    [_appSecret release];
    [_appID release];
    [_clientId release];
    [_payloadId release];
    [_realPath release];
    
    [super dealloc];
}

- (void)registerRemoteNotification
{
#ifdef __IPHONE_8_0
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        UIUserNotificationSettings *uns = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound) categories:nil];
        [[UIApplication sharedApplication] registerForRemoteNotifications];
        [[UIApplication sharedApplication] registerUserNotificationSettings:uns];
    } else {
        UIRemoteNotificationType apn_type = (UIRemoteNotificationType)(UIRemoteNotificationTypeAlert|UIRemoteNotificationTypeSound|UIRemoteNotificationTypeBadge);
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:apn_type];
    }
#else
    UIRemoteNotificationType apn_type = (UIRemoteNotificationType)(UIRemoteNotificationTypeAlert|UIRemoteNotificationTypeSound|UIRemoteNotificationTypeBadge);
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:apn_type];
#endif
}

- (id)init
{
    /** If you need to do any extra app-specific initialization, you can do it here
     *  -jm
     **/
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    
    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];
    
    int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
    int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
    NSURLCache* sharedCache = [[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"] autorelease];
    [NSURLCache setSharedURLCache:sharedCache];
    
    self = [super init];
    return self;
}

#pragma mark UIApplicationDelegate implementation

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    CGRect screenBounds = [[UIScreen mainScreen] bounds];
    
    //screenBounds.size.height = screenBounds.size.height+88;
    //if (CDV_IsIPhone()) {
    NSLog(@"screenBounds.size.height %f ", screenBounds.size.height);
    NSLog(@"__MainScreen_Height %f ", __MainScreen_Height);
    //NSLog(@"CDV_IsIPhone5() %@ ", CDV_IsIPhone5());
    //}
    
    //screenBounds.origin.x=1;
    //screenBounds.origin.y=1;
    
    self.window = [[[UIWindow alloc] initWithFrame:screenBounds] autorelease];
    [RCIMClient init:@"3argexb6rn84e" deviceToken:nil];
    self.window.autoresizesSubviews = YES;
    //self.window.setNeedsLayout;
    
    self.viewController = [[[MainViewController alloc] init] autorelease];
    self.viewController.useSplashScreen = YES;
    
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    // [1]:使用APPID/APPKEY/APPSECRENT创建个推实例
    [self startSdkWith:kAppId appKey:kAppKey appSecret:kAppSecret];
    // [2]:注册APNS
    [self registerRemoteNotification];
    
    // [2-EXT]: 获取启动时收到的APN
    NSDictionary* message = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if (message) {
        //NSString *payloadMsg = [message objectForKey:@"payload"];
        //NSString *record = [NSString stringWithFormat:@"[APN]%@, %@", [NSDate date], payloadMsg];
    }
    
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
    
    return YES;
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // [EXT] 切后台关闭SDK，让SDK第一时间断线，让个推先用APN推送
    [self stopSdk];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    /*
     Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
     */
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    // [EXT] 重新上线
    [self startSdkWith:_appID appKey:_appKey appSecret:_appSecret];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    /*
     Called when the application is about to terminate.
     Save data if appropriate.
     See also applicationDidEnterBackground:.
     */
}



- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
{
    NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
    [_deviceToken release];
    _deviceToken = [[token stringByReplacingOccurrencesOfString:@" " withString:@""] retain];
    NSLog(@"deviceToken:%@", _deviceToken);
    [[RCIMClient sharedRCIMClient] setDeviceToken:_deviceToken];
    // [3]:向个推服务器注册deviceToken
    if (_gexinPusher) {
        [_gexinPusher registerDeviceToken:_deviceToken];
    }
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
{
    // [3-EXT]:如果APNS注册失败，通知个推服务器
    if (_gexinPusher) {
        [_gexinPusher registerDeviceToken:@""];
    }
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userinfo
{
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
    
    // [4-EXT]:处理APN
    NSString *payloadMsg = [userinfo objectForKey:@"payload"];
    
    //NSString *record = [NSString stringWithFormat:@"[APN]%@, %@", [NSDate date], payloadMsg];
    //[_viewController logMsg:payloadMsg];
    self.window.rootViewController=self.viewController;
    
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
    
    // [4-EXT]:处理APN
    NSString *payloadMsg = [userInfo objectForKey:@"payload"];
    NSDictionary *aps = [userInfo objectForKey:@"aps"];
    NSNumber *contentAvailable = aps == nil ? nil : [aps objectForKeyedSubscript:@"content-available"];
    
    NSString *record = [NSString stringWithFormat:@"[APN]%@, %@, [content-available: %@]", [NSDate date], payloadMsg, contentAvailable];
    if ([UIApplication sharedApplication].applicationState ==UIApplicationStateActive ) {
        //orderInformationViewController *order = [[orderInformationViewController alloc]init];
        //[self.viewController presentViewController:order animated:YES completion:nil];
    }
    completionHandler(UIBackgroundFetchResultNewData);
}

- (void)startSdkWith:(NSString *)appID appKey:(NSString *)appKey appSecret:(NSString *)appSecret
{
    if (!_gexinPusher) {
        _sdkStatus = SdkStatusStoped;
        self.appID = appID;
        self.appKey = appKey;
        self.appSecret = appSecret;
        [_clientId release];
        _clientId = nil;
        NSError *err = nil;
        _gexinPusher = [GexinSdk createSdkWithAppId:_appID
                                             appKey:_appKey
                                          appSecret:_appSecret
                                         appVersion:@"0.0.0"
                                           delegate:self
                                              error:&err];
        if (!_gexinPusher) {
            //[_viewController logMsg:[NSString stringWithFormat:@"%@", [err localizedDescription]]];
        } else {
            _sdkStatus = SdkStatusStarting;
        }
        //[_viewController updateStatusView:self];
    }
}

- (void)stopSdk
{
    if (_gexinPusher) {
        [_gexinPusher destroy];
        [_gexinPusher release];
        _gexinPusher = nil;
        _sdkStatus = SdkStatusStoped;
        [_clientId release];
        _clientId = nil;
        //[_viewController updateStatusView:self];
    }
}

- (BOOL)checkSdkInstance
{
    if (!_gexinPusher) {
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"错误" message:@"SDK未启动" delegate:nil cancelButtonTitle:nil otherButtonTitles:@"确定", nil];
        [alertView show];
        [alertView release];
        return NO;
    }
    return YES;
}

- (void)setDeviceToken:(NSString *)aToken
{
    if (![self checkSdkInstance]) {
        return;
    }
    [_gexinPusher registerDeviceToken:aToken];
}

- (BOOL)setTags:(NSArray *)aTags error:(NSError **)error
{
    if (![self checkSdkInstance]) {
        return NO;
    }
    return [_gexinPusher setTags:aTags];
}

- (NSString *)sendMessage:(NSData *)body error:(NSError **)error {
    if (![self checkSdkInstance]) {
        return nil;
    }
    return [_gexinPusher sendMessage:body error:error];
}

- (void)bindAlias:(NSString *)aAlias {
    if (![self checkSdkInstance]) {
        return;
    }
    return [_gexinPusher bindAlias:aAlias];
}

- (void)unbindAlias:(NSString *)aAlias {
    if (![self checkSdkInstance]) {
        return;
    }
    return [_gexinPusher unbindAlias:aAlias];
}

// repost the localnotification using the default NSNoftificationCenter so multiple plugins may respond
- (void)            application:(UIApplication*)application
    didReceiveLocalNotification:(UILocalNotification*)notification
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVLocalNotification object:notification];
}

- (NSUInteger)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
{
    // iPhone doesn't support upside down by default, while the iPad does.  Override to allow all orientations always, and let the root view controller decide what's allowed (the supported orientations mask gets intersected).
    NSUInteger supportedInterfaceOrientations = (1 << UIInterfaceOrientationPortrait) | (1 << UIInterfaceOrientationLandscapeLeft) | (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationPortraitUpsideDown);
    
    return supportedInterfaceOrientations;
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication*)application
{
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
}


- (void)webViewDidFinishLoad{
    if(_realPath!=nil){
        NSString *js = @"window.NotificationCallback('%@');";
        NSString *href = [NSString stringWithFormat:js, _realPath];
        [self.viewController.webView stringByEvaluatingJavaScriptFromString:href];
//        [js release];
//        [href release];
    }
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if Gifted-Info.plist specifies a protocol to handle
- (BOOL)application:(UIApplication*)application handleOpenURL:(NSURL*)url
{
    if (!url) {
        return NO;
    }else{
        NSLog(@"url:%@", url);
        NSString* urlString = [NSString stringWithFormat:@"%@", url];
        if (urlString) { // TODO 判断是否是 gifted://com.fivepro.gifted  样例:gifted://com.fivepro.gifted/?route=productdetail&id=xxxx
            //NSError *error = nil;
            //NSString *pathWithPara = [NSString stringWithFormat:@"%@#product/detail/83a78824-9660-4fd1-abf0-97cbaaa07a45", path];
            //self.realPath = @"#product/search/catalog/1";
            self.realPath = urlString;
            //NSString *path = [[NSBundle mainBundle] pathForResource:@"www/index" ofType:@"html"];
            //NSURL *url = [NSURL fileURLWithPath:path];
            //NSURLRequest *request = [NSURLRequest requestWithURL:url];
            //[self.viewController.webView loadRequest:request];
            [self performSelector:@selector(webViewDidFinishLoad) withObject:self afterDelay:3];
//          [path release];
//          [url release];
//          [request release];
            return YES;
        }
        // calls into javascript global function 'handleOpenURL'
        //    NSString* jsString = [NSString stringWithFormat:@"handleOpenURL(\"%@\");", url];
        //    [self.viewController.webView stringByEvaluatingJavaScriptFromString:jsString];
        // all plugins will get the notification, and their handlers will be called
//      [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];
    }
    return YES;
}


#pragma mark - GexinSdkDelegate
- (void)GexinSdkDidRegisterClient:(NSString *)clientId
{
    // [4-EXT-1]: 个推SDK已注册
    _sdkStatus = SdkStatusStarted;
    [_clientId release];
    _clientId = [clientId retain];
    //将clientid传给插件
    //-(void)
    //[_viewController updateStatusView:self];
    //[self stopSdk];
}

//打开应用后才能获取的透传信息，如果既发送了通知消息又发送了透传消息，则在应用启动前只会收到通知消息，点击通知消息打开应用后会收到透传消息
- (void)GexinSdkDidReceivePayload:(NSString *)payloadId fromApplication:(NSString *)appId
{
    // [4]: 收到个推消息
    [_payloadId release];
    _payloadId = [payloadId retain];
    
    NSData *payload = [_gexinPusher retrivePayloadById:payloadId];
    NSString *payloadMsg = nil;
    if (payload) {
        payloadMsg = [[NSString alloc] initWithBytes:payload.bytes
                                              length:payload.length
                                            encoding:NSUTF8StringEncoding];
    }
    //NSString *record = [NSString stringWithFormat:@"%d, %@, %@", ++_lastPaylodIndex, [NSDate date], payloadMsg];
    //[_viewController logMsg:payloadMsg];
    if (payloadMsg!=nil) {
        //self.realPath = @"#product/search/catalog/1";
        self.realPath = payloadMsg;
        //打开应用后收到了透传消息，则跳转页面到消息模块
        [self performSelector:@selector(webViewDidFinishLoad) withObject:self afterDelay:0];
//        NSString *path = [[NSBundle mainBundle] pathForResource:@"www/index" ofType:@"html"];
//        NSString *url =[NSString stringWithFormat:@"%@%@",path,_realPath];
//        NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL fileURLWithPath:url]];
//        [self.viewController.webView loadRequest:request];
        
        
        
//        [url release];
//        [request release];
        [payloadMsg release];
    }
}



- (void)GexinSdkDidSendMessage:(NSString *)messageId result:(int)result {
    // [4-EXT]:发送上行消息结果反馈
    //NSString *record = [NSString stringWithFormat:@"Received sendmessage:%@ result:%d", messageId, result];
    //[_viewController logMsg:record];
}

- (void)GexinSdkDidOccurError:(NSError *)error
{
    // [EXT]:个推错误报告，集成步骤发生的任何错误都在这里通知，如果集成后，无法正常收到消息，查看这里的通知。
    //[_viewController logMsg:[NSString stringWithFormat:@">>>[GexinSdk error]:%@", [error localizedDescription]]];
}


@end
