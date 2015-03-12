//
//  MessageUtil.m
//  Gifted
//
//  Created by daichao on 15/3/10.
//
//

#import <Foundation/Foundation.h>
#import "MessageUtil.h"
#import <Cordova/CDV.h>

#import "RCMessage.h"
#import "RCImageMessage.h"
#import "RCTextMessage.h"
#import "RCVoiceMessage.h"
#import "RCIMClient.h"
#import "RCStatusDefine.h"
#import "RCGroup.h"
#import "RCRichContentMessage.h"
#import "RCProfileNotificationMessage.h"
#import "RCCommandNotificationMessage.h"
#import "RCContactNotificationMessage.h"

@interface MessageUtil ()<RCReceiveMessageDelegate,RCConnectDelegate,RCSendMessageDelegate>

@property (nonatomic,strong) NSURL *recordedFile ;
@property (nonatomic,strong) AVAudioPlayer *player;
@property (nonatomic,strong) AVAudioRecorder *recorder;
@property (nonatomic) NSString *userId;

@end


@implementation MessageUtil

RCIMClient *client;
@synthesize callbackId;

//连接融云服务器
- (void)connectIMServer:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
   self.callbackId = [arguments objectAtIndex:0];
    NSString *IMTOKEN=[arguments objectAtIndex:1];
    client=[[RCIMClient alloc]init];
    if(IMTOKEN!=nil){
        if(client!=nil){
         [client disconnect:NO];
        }
         [RCIMClient connect:IMTOKEN delegate:self];
    }
}




- (void)clearUnreadCount:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult* result=nil;
    self.callbackId = [arguments objectAtIndex:0];
    NSNumber *type=(NSNumber *)[arguments objectAtIndex:1];
//    NSUInteger *cType=[NSNumber numberWithInteger:<#(NSInteger)#>]
    NSString *conversationId=[arguments objectAtIndex:2];
    NSNumber *cType=[NSNumber numberWithInteger:ConversationType_PRIVATE];
    if([type isEqualToNumber:cType]){//默认是私聊
        NSInteger *count=nil;//unreadcount
        BOOL success=[client clearMessagesUnreadStatus:ConversationType_PRIVATE targetId:conversationId];//清理未读取消息状态
        NSString *json=nil;
        if(success){
            json=[self returnJson:0];
            
        }
        else{
            count=[client getUnreadCount:ConversationType_PRIVATE targetId:conversationId];
            json=[self returnJson:count];
//             json.put("unreadCount", client.getConversation(cType, conversationId).getUnreadMessageCount());
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:json];
        [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
    }
}
//仅用于转换unreadcount
-(NSString*)returnJson:(NSInteger*) unreadCount{
            NSString *jsonData=nil;
            NSString *jsonString=[NSString stringWithFormat:@"{\"unreadCount\":\"%@\"}",unreadCount];
            NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
            id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            jsonData=json;
            return jsonData;
}

//获取回话列表
- (void)getConversationList:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    
    NSNumber *cType=[NSNumber numberWithInteger:ConversationType_PRIVATE];//将枚举类型的会话类型转换成数值类型
    NSArray *clist=[NSArray arrayWithObjects:cType, nil];//将数值类型转换成数组
   NSArray *list= [client getConversationList:clist];//这里默认会话都为私聊
    
//    List<Conversation> list = client.getConversationList();
//				JSONArray conversationList = new JSONArray();
//				for(Conversation conversation : list){
//                    String title = conversation.getConversationTitle();
//                    String conversationType = conversation.getConversationType().name();
//                    MessageContent lastMessage = conversation.getLatestMessage();
//                    int lastMessageId = conversation.getLatestMessageId();
//                    String senderId = conversation.getSenderUserId();
//                    //int receiveStatus = conversation.getReceivedStatus().getFlag();
//                    long sendTime = conversation.getSentTime();
//                    String senderName = conversation.getSenderUserName();
//                    String targetId = conversation.getTargetId();
//                    int unreadCount = conversation.getUnreadMessageCount();
//                    JSONObject json = new JSONObject(new String(lastMessage.encode(),"UTF-8"));
//                    json.put("title", title);
//                    json.put("senderId", senderId);
//                    json.put("senderName", senderName);
//                    json.put("MESSAGEID",lastMessageId);
//                    json.put("targetId", targetId);
//                    json.put("time", sendTime);
//                    json.put("conversationType", conversationType);
//                    //json.put("receiveStatus", receiveStatus);
//                    json.put("unreadCount", unreadCount);
//                    conversationList.put(json);
//                }
//				callbackContext.success(conversationList);
    
    
}

- (void)consumeMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{

}

- (void)sendTextMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{

}

- (void)loadHistory:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{

}




#pragma mark - 图片消息
-(void)sendImageMessage:(UIImage*)image{
    
    RCImageMessage *rcImageMessage = [RCImageMessage messageWithImage:image];
    
    [[RCIMClient sharedRCIMClient] sendMessage:ConversationType_PRIVATE
                                      targetId:self.userId
                                       content:rcImageMessage
                                      delegate:self object:nil];
    
    
}

//-(void)publishLocalNotification:(NSString *)message {
//    //设置1秒之后
//    
//    NSDate *date = [NSDate dateWithTimeIntervalSinceNow:2];
//    
//    //chuagjian一个本地推送
//    
//    UILocalNotification *noti = [[UILocalNotification alloc] init] ;
//    
//    //设置推送时间
//    
//    noti.fireDate = date;
//    
//    //设置时区
//    
//    noti.timeZone = [NSTimeZone defaultTimeZone];
//    
//    //设置重复间隔
//    
//    noti.repeatInterval = NSCalendarUnitWeekday;
//    
//    //推送声音
//    
//    noti.soundName = UILocalNotificationDefaultSoundName;
//    //内容
//    
//    noti.alertBody = message;
//    
//    //显示在icon上的红色圈中的数子
//    
//    noti.applicationIconBadgeNumber = 1;
//    
//    //设置userinfo 方便在之后需要撤销的时候使用
//    
//    NSDictionary *infoDic = [NSDictionary dictionaryWithObject:@"name" forKey:@"key"];
//    
//    noti.userInfo = infoDic;
//    
//    //添加推送到uiapplication
//    
//    UIApplication *app = [UIApplication sharedApplication];
//    
//    [app scheduleLocalNotification:noti];
//}

#pragma mark - RCReceiveMessageDelegate
-(void)responseOnReceived:(RCMessage *)message left:(int)nLeft object:(id)object
{
    NSLog(@"消息接收成功 ! ");
    
    NSString *mmm = nil;
    
    if ([message.content isKindOfClass:[RCVoiceMessage class]]) {
        RCVoiceMessage *msg = (RCVoiceMessage *) message.content;
        _player = [[AVAudioPlayer alloc] initWithData:msg.wavAudioData error:NULL];
        [_player play];
        NSLog(@"======>>>> 语音消息内容 %@ <<<===>>> 扩展字段 %@",message,message.extra);
        mmm = @"xxx";
    }
    
//    if ([message.content isKindOfClass:[GroupInvitationNotification class]]) {
//        GroupInvitationNotification *notti = (GroupInvitationNotification *) message.content;
//        NSLog(@"======>>>> 自定消息内容 %@ %@ <<<===>>> 扩展字段 %@",notti.groupId,notti.message,notti.extra);
//        mmm = @"GroupInvitationNotification";
//    }
    
    if ([message.content isKindOfClass:[RCImageMessage class]]) {
        RCImageMessage *msg = (RCImageMessage *) message.content;
        NSLog(@"=======>>>> 图片消息 %@ <<<===>>> 扩展字段 %@",msg,msg.extra);
        mmm = @"RCImageMessage";
    }
    
    if ([message.content isKindOfClass:[RCTextMessage class]]) {
        RCTextMessage *msg = (RCTextMessage *) message.content;
        NSLog(@"=======>>>>>> 文字消息 %@ <<<===>>> 扩展字段 %@",msg.content,msg.extra);
        mmm = @"RCTextMessage";
    }
    
    if ([message.content isKindOfClass:[RCRichContentMessage class]]) {
        RCRichContentMessage *msg = (RCRichContentMessage *) message.content;
        NSLog(@"=======>>>>>> 图文消息 %@ <<<===>>> 扩展字段 %@",msg,msg.extra);
        mmm = @"RCRichContentMessage";
    }
    
    if ([message.content isKindOfClass:[RCProfileNotificationMessage class]]) {
        RCProfileNotificationMessage *msg = (RCProfileNotificationMessage *) message.content;
        NSLog(@"====>>>>> 资料变更消息：%@ <<<===>>>%@ %@ %@",msg,msg.extra,msg.data,msg.operation);
    }
    if ([message.content isKindOfClass:[RCCommandNotificationMessage class]]) {
        RCCommandNotificationMessage *msg = (RCCommandNotificationMessage *) message.content;
        NSLog(@"====>>>>> 命令操作消息：%@ <<<===>>> %@ %@",msg,msg.name ,msg.data);
    }
    
    if ([message.content isKindOfClass:[RCContactNotificationMessage class]]) {
        RCContactNotificationMessage *msg = (RCContactNotificationMessage *) message.content;
        NSLog(@"====>>>>> 好友添加消息：%@ <<<===>>> %@ %@ %@ %@ %@ ",msg,msg.operation,msg.sourceUserId,msg.targetUserId,msg.message,msg.extra);
    }
    
    [self publishLocalNotification:mmm];
    
}

#pragma mark - RCConnectDelegate
-(void)responseConnectSuccess:(NSString *)userId
{
     CDVPluginResult* pluginResult = nil;
    
    [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"DemoUserId"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    self.userId = userId;
    if(self.userId!=nil){
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:self.userId];
       [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
    }

    NSLog(@"连接成功！");
}

-(void)responseConnectError:(RCConnectErrorCode)errorCode
{
    NSLog(@"连接失败！ errorCode is %ld",(long)errorCode);
}




#pragma mark - RCSendMessageDelegate
- (void)responseSendMessageStatus:(RCErrorCode)errorCode messageId:(long)messageId object:(id)object
{
    if(errorCode == 0)
        NSLog(@"消息已发送!");
}

-(void)responseProgress:(int)progress messageId:(long)messageId object:(id)object
{
    NSLog(@"图片发送进度 %d",progress);
    if (progress == 100) {
        NSLog(@"发送图片成功!");
    }
}

-(void)responseError:(int)errorCode messageId:(long)messageId object:(id)object {
    
}




@end