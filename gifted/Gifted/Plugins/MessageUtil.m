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
#import "JSONKit.h"
#import "RCConversation.h"
#import "RCMessageContent.h"
#import "AppDelegate.h"
#import "MessageQueue.h"

@interface MessageUtil ()<RCReceiveMessageDelegate,RCConnectDelegate,RCSendMessageDelegate>

@property (nonatomic,strong) NSURL *recordedFile ;
@property (nonatomic,strong) AVAudioPlayer *player;
@property (nonatomic,strong) AVAudioRecorder *recorder;
@property (nonatomic) NSString *userId;
@property (nonatomic,strong)RCIMClient *client;
@property (nonatomic,strong)RCMessage *message;
@end



@implementation MessageUtil

@synthesize  client;
@synthesize callbackId;
@synthesize message;

static int mmCount;

//连接融云服务器
- (void)connectIMServer:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *IMTOKEN=[arguments objectAtIndex:1];
    AppDelegate *appDelegate = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    self.client=appDelegate.client;
    if(IMTOKEN!=nil){
         [RCIMClient connect:IMTOKEN delegate:self];
         [[RCIMClient sharedRCIMClient] setReceiveMessageDelegate:self object:nil];
            CDVPluginResult* pluginResult = nil;
            if(self.userId!=nil){
//                [self userId]
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[self userId]];
               [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
            }
    }
}

//清除未读消息数
- (void)clearUnreadCount:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult* result=nil;
    self.callbackId = [arguments objectAtIndex:0];
    NSString *conversationType=[arguments objectAtIndex:1];//@"PRIVATE"
    NSString *conversationId=[arguments objectAtIndex:2];//@"1"
    if([conversationType isEqualToString:@"PRIVATE"]){//默认是私聊
        BOOL success=[self.client clearMessagesUnreadStatus:ConversationType_PRIVATE targetId:conversationId];//清理未读取消息状态
        NSDictionary *json=nil;
        NSNumber *unreadCount=[[NSNumber alloc]init];
        if(success){
            unreadCount=[NSNumber numberWithInt:0];
            json=[self returnJson:unreadCount];
        }
        else{
            unreadCount=[NSNumber numberWithInt:[[self.client getConversation:ConversationType_PRIVATE targetId:conversationId] unreadMessageCount]];
            json=[self returnJson:unreadCount];
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:json];
        [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
    }
}
//仅用于转换unreadcount
-(NSDictionary*)returnJson:(NSNumber*) unreadCount{
            NSString *jsonString=[NSString stringWithFormat:@"{\"unreadCount\":\"%@\"}",unreadCount];
            NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
            id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            return json;
}

//获取私聊会话列表
- (void)getConversationList:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult* result=nil;
    NSString *CType=nil;
    NSMutableArray *jsonArray=[[NSMutableArray alloc]init];
    NSNumber *cType=[NSNumber numberWithInteger:ConversationType_PRIVATE];//将枚举类型的会话类型转换成数值类型
    NSArray *clist=[NSArray arrayWithObject:cType];//将数值类型转换成数组 私聊类型的列表
    NSMutableArray *conversationList= [NSMutableArray arrayWithArray:[self.client getConversationList:clist]];//这里默认会话都为私聊
        RCConversation *conversation=[[RCConversation alloc]init];
        for(conversation in conversationList){
            NSString *title=[conversation conversationTitle];
            NSNumber *conversationType=[NSNumber numberWithInteger:[conversation conversationType] ];
            if([conversationType isEqualToNumber:[NSNumber numberWithInt:1]]){
                CType=@"PRIVATE";
            }
            RCMessageContent *lastMessage=[conversation lastestMessage];

            
                NSMutableDictionary *JSON=[[NSMutableDictionary alloc]init];
                NSData *jtmp=[lastMessage encode];
                NSString* lastMsgContentStr=[[jtmp  objectFromJSONData] valueForKey:@"content"];

                NSString *lastMessageId=[conversation lastestMessageId];
                NSString *senderId=[conversation senderUserId];
                long long sendTime=[conversation sentTime];
                NSString *timestr=[self timesp2timestr:sendTime];
            
            
                NSString *senderName=[conversation senderUserName];
                NSString *targetId=[conversation targetId];
                NSNumber *unreadCount=[NSNumber numberWithInteger:[conversation unreadMessageCount]];
                
                [JSON setValue:lastMsgContentStr forKey:@"content"];
                [JSON setValue:title forKey:@"title"];
                [JSON setValue:senderId forKey:@"senderId"];
                [JSON setValue:senderName forKey:@"senderName"];//没有这个值
                [JSON setValue:lastMessageId forKey:@"MESSAGEID"];
                [JSON setValue:targetId forKey:@"targetId"];
                [JSON setValue:timestr forKey:@"time"];
                [JSON setValue:CType forKey:@"conversationType"];
                [JSON setValue:unreadCount forKey:@"unreadCount"];

            [jsonArray addObject:JSON];
            
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:jsonArray];
        [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
}


//时间戳转时间
-(NSString*)timesp2timestr:(long long)timesp{
    NSDate *tsp=[NSDate dateWithTimeIntervalSince1970:(timesp/1000)];
    NSDateFormatter *formatter = [[[NSDateFormatter alloc] init] autorelease];
    [formatter setDateStyle:NSDateFormatterMediumStyle];
    [formatter setTimeStyle:NSDateFormatterShortStyle];
    [formatter setDateFormat:@"YYYY-MM-dd HH:mm:ss"];
    NSString *timestr=[formatter stringFromDate:tsp];
    return timestr;
}

//返回最新的消息
- (void)consumeMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult *result=nil;
    RCMessage *msg=[MessageQueue consumeMessage];
    if(msg!=nil){
        NSDictionary *json=[self message2json:msg];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:json];
        [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
    }
    else{
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
        [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
    }
    
}

//将message转换成json
-(NSDictionary*)message2json:(RCMessage*)msg{
    NSString *imageURL = nil;
    NSString *content=nil;
    NSString *title=nil;
//    NSString *pushContent=nil;
//    NSString *extraData=nil;
    RCMessageContent* mgc=[msg content];
    if([mgc isKindOfClass:RCRichContentMessage.class]){
        RCRichContentMessage* richMgc = (RCRichContentMessage*)mgc;
        imageURL=[richMgc imageURL];
        content=[richMgc digest];
        title=[richMgc title];
//        pushContent=[richMgc pushContent];
//        extraData=[richMgc extra];
    }
    else{
        RCTextMessage* textMgc=(RCTextMessage*)mgc;
        content=[textMgc content];
    }
    NSString *cType=[[NSString alloc]initWithString:@"PRIVATE"];
    NSString *direction=nil;
    if (msg.messageDirection==MessageDirection_SEND){
        direction=@"SEND";
    }
    else{
        direction=@"RECEIVE";
    }
    
    NSString *jsonString= nil;
    if([mgc isKindOfClass:RCRichContentMessage.class]){
        jsonString=[NSString stringWithFormat:@"{\"title\":\"%@\",\"imageUri\":\"%@\",\"content\":\"%@\",\"senderId\":\"%@\",\"MESSAGEID\":\"%ld\",\"targetId\":\"%@\",\"time\":\"%@\",\"direction\":\"%@\",\"conversationType\":\"%@\"}",title,imageURL,content,[msg senderUserId],[msg messageId],[msg targetId],[self timesp2timestr:[msg sentTime]],direction,cType];
    }
    else{
        jsonString=[NSString stringWithFormat:@"{\"content\":\"%@\",\"senderId\":\"%@\",\"MESSAGEID\":\"%ld\",\"targetId\":\"%@\",\"time\":\"%@\",\"direction\":\"%@\",\"conversationType\":\"%@\"}",content,[msg senderUserId],[msg messageId],[msg targetId],[self timesp2timestr:[msg sentTime]],direction,cType];
    }
    NSData *data=[jsonString dataUsingEncoding:NSUTF8StringEncoding];
    id json=[NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    return json;
}

//发送文本消息
- (void)sendTextMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSString *toUserId=[arguments objectAtIndex:1];//targetId
    NSString *context=[arguments objectAtIndex:2];//content
    NSString *senderId=[arguments objectAtIndex:3];
    RCTextMessage *textMessage=[[RCTextMessage alloc]init];
    [textMessage setContent:context];
    RCMessage *msg=[self.client sendMessage:ConversationType_PRIVATE targetId:toUserId content:textMessage delegate:self object:nil];
    [msg setSenderUserId:senderId];
  
    NSDictionary *json=[self message2json:msg];
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:json];
    [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
  
}


//发送富文本消息
- (void)sendRichContentMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSString *toUserId=[arguments objectAtIndex:1];
    NSString *title=[arguments objectAtIndex:2];
    NSString *content=[arguments objectAtIndex:3];
    NSString *imageUri=[arguments objectAtIndex:4];
    NSString *senderId=[arguments objectAtIndex:5];
    RCRichContentMessage *richMessage=[[RCRichContentMessage alloc]init];
    [richMessage setTitle:title];
    [richMessage setImageURL:imageUri];
    [richMessage setDigest:content];
    [richMessage setPushContent:content];
    [richMessage setExtra:content];
    RCMessage *msg=[self.client sendMessage:(ConversationType_PRIVATE) targetId:toUserId content:richMessage delegate:self object:nil];
    [msg setSenderUserId:senderId];
    NSDictionary *json=[self message2json:msg];
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:json];
    [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
}


//获取历史消息
- (void)loadHistory:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
     CDVPluginResult *result=nil;
    NSString *cType=[arguments objectAtIndex:1];
    
    RCConversationType conversationType=[self getConversationType:cType];
    NSString *cId=[arguments objectAtIndex:2];
    NSString *lastMsgId=[arguments objectAtIndex:3];
    NSNumber *lMsgId=[NSNumber numberWithInt:[lastMsgId intValue]];

    
     NSString* countNS=[arguments objectAtIndex:4];
    NSNumber *count=[NSNumber numberWithInt:[countNS intValue]];
    if(cId==nil||cType==nil||lastMsgId==0||count==0){
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:nil];
        [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
    }
    NSArray * messages=[self.client getHistoryMessages:conversationType targetId:cId oldestMessageId:(long)lMsgId count:[count intValue] ];
    
    NSMutableArray *jsonArray=[[NSMutableArray alloc]init];
    RCMessage *msg=[[RCMessage alloc]init];
    for(msg in messages){
        NSDictionary *jsonDic=[self message2json:msg];
        NSMutableDictionary *json=[NSMutableDictionary dictionaryWithDictionary:jsonDic];
        [json setValue:lMsgId forKey:@"nextMessageId"];
        [jsonArray addObject:json];
    }
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:jsonArray];
    [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
}

//转换聊天类型
-(RCConversationType)getConversationType:(NSString*)cType{
    RCConversationType cctype=0;
    if([cType isEqualToString:@"1"]||[cType isEqualToString:@"PRIVATE"]){
        cctype=(ConversationType_PRIVATE);
        return cctype;
    }
    return cctype;
    
}



#pragma mark - 图片消息
-(void)sendImageMessage:(UIImage*)image{
    
    RCImageMessage *rcImageMessage = [RCImageMessage messageWithImage:image];
    
    [[RCIMClient sharedRCIMClient] sendMessage:ConversationType_PRIVATE
                                      targetId:self.userId
                                       content:rcImageMessage
                                      delegate:self object:nil];
    
}

#pragma mark - RCReceiveMessageDelegate
-(void)responseOnReceived:(RCMessage *)Msg left:(int)nLeft object:(id)object
{
    NSLog(@"消息接收成功 ! ");
    [MessageQueue addMessage:Msg];
    NSString *mmm = nil;
    
    if ([Msg.content isKindOfClass:[RCTextMessage class]]) {
        RCTextMessage *msg = (RCTextMessage *) Msg.content;
        NSLog(@"=======>>>>>> 文字消息 %@ <<<===>>> 扩展字段 %@",msg.content,msg.extra);
        mmm = [msg content];
    }
    
    if ([Msg.content isKindOfClass:[RCRichContentMessage class]]) {
        RCRichContentMessage *msg = (RCRichContentMessage *) Msg.content;
        NSLog(@"=======>>>>>> 图文消息 %@ <<<===>>> 扩展字段 %@",msg,msg.extra);
        mmm = [msg imageURL];
    }
    
//    if ([Msg.content isKindOfClass:[RCVoiceMessage class]]) {
//        RCVoiceMessage *msg = (RCVoiceMessage *) Msg.content;
//        _player = [[AVAudioPlayer alloc] initWithData:msg.wavAudioData error:NULL];
//        [_player play];
//        NSLog(@"======>>>> 语音消息内容 %@ <<<===>>> 扩展字段 %@",message,message.extra);
//        mmm = @"xxx";
//    }
    
//    if ([message.content isKindOfClass:[GroupInvitationNotification class]]) {
//        GroupInvitationNotification *notti = (GroupInvitationNotification *) message.content;
//        NSLog(@"======>>>> 自定消息内容 %@ %@ <<<===>>> 扩展字段 %@",notti.groupId,notti.message,notti.extra);
//        mmm = @"GroupInvitationNotification";
//    }
    
    if ([Msg.content isKindOfClass:[RCImageMessage class]]) {
        RCImageMessage *msg = (RCImageMessage *) Msg.content;
        NSLog(@"=======>>>> 图片消息 %@ <<<===>>> 扩展字段 %@",msg,msg.extra);
        mmm = @"RCImageMessage";
    }
    
    
//    
//    if ([message.content isKindOfClass:[RCProfileNotificationMessage class]]) {
//        RCProfileNotificationMessage *msg = (RCProfileNotificationMessage *) message.content;
//        NSLog(@"====>>>>> 资料变更消息：%@ <<<===>>>%@ %@ %@",msg,msg.extra,msg.data,msg.operation);
//    }
//    if ([message.content isKindOfClass:[RCCommandNotificationMessage class]]) {
//        RCCommandNotificationMessage *msg = (RCCommandNotificationMessage *) message.content;
//        NSLog(@"====>>>>> 命令操作消息：%@ <<<===>>> %@ %@",msg,msg.name ,msg.data);
//    }
//    
//    if ([message.content isKindOfClass:[RCContactNotificationMessage class]]) {
//        RCContactNotificationMessage *msg = (RCContactNotificationMessage *) message.content;
//        NSLog(@"====>>>>> 好友添加消息：%@ <<<===>>> %@ %@ %@ %@ %@ ",msg,msg.operation,msg.sourceUserId,msg.targetUserId,msg.message,msg.extra);
//    }
    
    [self publishLocalNotification:mmm];
    
}




-(void)publishLocalNotification:(NSString *)mm {
    while(mm!=nil){
        mmCount++;
    }
    //设置1秒之后
    
    NSDate *date = [NSDate dateWithTimeIntervalSinceNow:2];
    
    //chuagjian一个本地推送
    
    UILocalNotification *noti = [[UILocalNotification alloc] init] ;
    
    //设置推送时间
    
    noti.fireDate = date;
    
    //设置时区
    
    noti.timeZone = [NSTimeZone defaultTimeZone];
    
    //设置重复间隔
    
    noti.repeatInterval = NSCalendarUnitWeekday;
    
    //推送声音
    
    noti.soundName = UILocalNotificationDefaultSoundName;
    //内容
    
    noti.alertBody = [NSString stringWithFormat:@"%d", mmCount];
    
    //显示在icon上的红色圈中的数子
    
    noti.applicationIconBadgeNumber = 1;
    
    //设置userinfo 方便在之后需要撤销的时候使用
    
    NSDictionary *infoDic = [NSDictionary dictionaryWithObject:@"name" forKey:@"key"];
    
    noti.userInfo = infoDic;
    
    //添加推送到uiapplication
    
    UIApplication *app = [UIApplication sharedApplication];
    
    [app scheduleLocalNotification:noti];
}


#pragma mark - RCConnectDelegate
-(void)responseConnectSuccess:(NSString *)userId
{
    [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"DemoUserId"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    if(userId!=nil){
        self.userId = userId;
        NSLog(@"连接成功！");
    }
    
}

-(void)responseConnectError:(RCConnectErrorCode)errorCode
{
    NSLog(@"连接失败！ errorCode is %ld",(long)errorCode);
}




#pragma mark - RCSendMessageDelegate
- (void)responseSendMessageStatus:(RCErrorCode)errorCode messageId:(long)messageId object:(id)object
{
    if(errorCode == 0){
             NSLog(@"消息已发送!");
    }
    else{
        NSLog(@"消息发送失败！");
    }
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