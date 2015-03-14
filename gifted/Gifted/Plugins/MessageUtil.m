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
@end



@implementation MessageUtil

//RCIMClient *client;
@synthesize callbackId;

////发送文本消息
//- (IBAction)sendText:(id)sender {
//    
//    RCTextMessage *rcImageMessage = [RCTextMessage messageWithContent:@"This is a test message!"];
//    [rcImageMessage setExtra:@"(extra_text 扩展字段)"];
//    
//    [[RCIMClient sharedRCIMClient] sendMessage:ConversationType_PRIVATE
//                                      targetId:self.userId
//                                       content:rcImageMessage
//                                      delegate:self object:nil];
//}
////图文消息
//- (IBAction)sendImgAndText:(id)sender {
//    
//    RCRichContentMessage *msg = [RCRichContentMessage messageWithTitle:@"图文消息" digest:@"这是一条吴文消息" imageURL:@"http://www.baidu.com" extra:@"图文扩展字段"];
//    [msg setExtra:@"(extra_text 扩展字段)"];
//    
//    [[RCIMClient sharedRCIMClient] sendMessage:ConversationType_PRIVATE targetId:self.userId content:msg delegate:self object:nil];
//    
//    
//}

//连接融云服务器
- (void)connectIMServer:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *IMTOKEN=[arguments objectAtIndex:1];
    AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    self.client=appDelegate.client;
    if(IMTOKEN!=nil){
        if(self.client!=nil){
         [self.client disconnect:NO];
            
        }
        else{
         [RCIMClient connect:IMTOKEN delegate:self];
        }
    }
}



//清除未读
- (void)clearUnreadCount:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult* result=nil;
    NSNumber *type=nil;
    self.callbackId = [arguments objectAtIndex:0];
    NSString *conversationType=[arguments objectAtIndex:1];//@"PRIVATE"
    if([conversationType isEqualToString :@"PRIVATE"]){
        type=[NSNumber numberWithInt:1];
    }
    NSString *conversationId=[arguments objectAtIndex:2];
    NSNumber *cType=[NSNumber numberWithInteger:ConversationType_PRIVATE];
    if([type isEqualToNumber:cType]){//默认是私聊
        NSNumber *count=nil;//unreadcount
        BOOL success=[self.client clearMessagesUnreadStatus:ConversationType_PRIVATE targetId:conversationId];//清理未读取消息状态
        NSString *json=nil;
        if(success){
            json=[self returnJson:0];
            
        }
        else{
            count=[NSNumber numberWithInteger:[self.client getUnreadCount:ConversationType_PRIVATE targetId:conversationId]];
            json=[self returnJson:count];
//             json.put("unreadCount", client.getConversation(cType, conversationId).getUnreadMessageCount());
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:json];
        [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
    }
}
//仅用于转换unreadcount
-(NSString*)returnJson:(NSNumber*) unreadCount{
            NSString *jsonData=nil;
            NSString *jsonString=[NSString stringWithFormat:@"{\"unreadCount\":\"%@\"}",unreadCount];
            NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
            id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            jsonData=json;
            return jsonData;
}

//获取会话列表
- (void)getConversationList:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult* result=nil;
    NSMutableArray *jsonArray=[[NSMutableArray alloc]init];
    NSNumber *cType=[NSNumber numberWithInteger:ConversationType_PRIVATE];//将枚举类型的会话类型转换成数值类型
    NSArray *clist=[NSArray arrayWithObject:cType];//将数值类型转换成数组
    NSArray *list= [self.client getConversationList:clist];//这里默认会话都为私聊
        RCConversation *conversation=[[RCConversation alloc]init];
        for(conversation in list){
            NSString *title=[conversation conversationTitle];
            NSNumber *conversationType=[NSNumber numberWithInteger:[conversation conversationType] ];
            RCMessageContent *lastMessage=[conversation lastestMessage];
            NSString *mc=[lastMessage pushContent];
            NSLog(@"%@",mc);
            if(mc==nil || mc==Nil || mc==NULL){
                //result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"NO DATA"];
                //[self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
                continue;
            }
            
            NSString *lastMessageId=[conversation lastestMessageId];
            NSString *senderId=[conversation senderUserId];
            long sendTime=[conversation sentTime];
            NSString *senderName=[conversation senderUserName];
            NSString *targetId=[conversation targetId];
            int unreadCount=[conversation unreadMessageCount];
            // NSData *data=[lastMessage dataUsingEncoding:NSUTF8StringEncoding];
            
            NSString *jsonString=[NSString stringWithFormat:@"{\"title\":\"%@\",\"senderId\":\"%@\",\"senderName\":\"%@\",\"MESSAGEID\":\"%@\",\"targetId\":\"%@\",\"time\":\"%ld\",\"conversationType\":\"%@\",\"unreadCount\":\"%d\"}",title,senderId,senderName,lastMessageId,targetId,sendTime,conversationType,unreadCount];
            NSData *data=[jsonString dataUsingEncoding:NSUTF8StringEncoding];
            id json=[NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            id jsonLastMessage=[NSJSONSerialization JSONObjectWithData:[[lastMessage pushContent] dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
            jsonLastMessage=json;
            [jsonArray addObject:jsonLastMessage];
            
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:jsonArray];
        [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
}


//返回最新的消息
- (void)consumeMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult *result=nil;
    RCMessage *message=[MessageQueue consumeMessage];
    if(message!=nil){
        NSString *json=[self message2json:message];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:json];
        [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
    }
}

//将message转换成json
-(NSString*)message2json:(RCMessage*)message{
    NSNumber *cType=[NSNumber numberWithInteger:[message conversationType]];
    NSNumber *direction=[NSNumber numberWithInteger:[message messageDirection]];
    NSString *jsonString=[NSString stringWithFormat:@"{\"senderId\":\"%@\",\"MESSAGEID\":\"%ld\",\"targetId\":\"%@\",\"time\":\"%lld\",\"direction\":\"%@\",\"conversationType\":\"%@\"}",[message senderUserId],[message messageId],[message targetId],[message sentTime],direction,cType];
    
    NSData *data=[jsonString dataUsingEncoding:NSUTF8StringEncoding];
    id json=[NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    return json;
}

//发送文本消息
- (void)sendTextMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult *result=nil;
    NSString *senderId=[arguments objectAtIndex:1];
    NSString *toUserId=[arguments objectAtIndex:2];//targetId
    NSString *context=[arguments objectAtIndex:3];//content
    RCTextMessage *textMessage=[RCTextMessage messageWithContent:context];
    [textMessage setExtra:toUserId];
    [textMessage setPushContent:context];
    RCMessage *message=[self.client sendMessage:ConversationType_PRIVATE targetId:toUserId content:textMessage delegate:self object:nil];
    [message setSenderUserId:senderId];
    [message setMessageDirection:MessageDirection_SEND];
    [message setConversationType:ConversationType_PRIVATE];
    NSLog(@"message is %@",[message senderUserId]);
    @try{
        NSString *json=[self message2json:message];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:json];
        [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
        
    }@catch(NSException* exception){
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"发送消息失败！"];
        [self writeJavascript:[result toErrorCallbackString:[arguments objectAtIndex:0]]];
    }
}

//获取历史消息
- (void)loadHistory:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
//    conversationType,conversationId,lastMessageId,count
    NSString *cType=[arguments objectAtIndex:1];//@"PRIVATE"
    RCConversationType *conversationType=[self getConversationType:cType];
    NSString *cId=[arguments objectAtIndex:2];
    NSNumber *lastMsgId=[arguments objectAtIndex:3];
    NSNumber *count=[arguments objectAtIndex:4];
    NSArray * messages=[self.client getHistoryMessages:*conversationType targetId:cId oldestMessageId:lastMsgId count:count];
    NSMutableArray *jsonArray=[[NSMutableArray alloc]init];
    
    
//    for(RCMessage *message:messages){
//        NSString *json=[self message2json:message];
    
//    }
//    String type = args.getString(0);
//				String conversationId = args.getString(1);
//				int lastMessageId = args.getInt(2);
//				int count = args.getInt(3);
//				RongIMClient.ConversationType cType = getConversationType(type);
//				List<Message> messages = client.getHistoryMessages(cType, conversationId, lastMessageId, count);
//				JSONArray array = new JSONArray();
//				int nextMessageId = lastMessageId;
//				for(Message message : messages){
//                    JSONObject json = message2Json(message);
//                    json.put("nextMessageId", nextMessageId);
//                    nextMessageId = json.getInt("MESSAGEID");
//                    array.put(json);
//                }
//				callbackContext.success(array);
}

-(RCConversationType*)getConversationType:(NSString*)cType{
    RCConversationType *ConversationType=nil;
    if([cType isEqualToString:@"PRIVATE"]){
        *ConversationType=ConversationType_PRIVATE;
    }
    return ConversationType;
    
}

//发送富文本消息
- (void)sendRichContentMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{

//    String toUserId = args.getString(0);
//				String title = args.getString(1);
//				String content = args.getString(2);
//				String imageUri = args.getString(3);
//				RichContentMessage richMessage = new RichContentMessage();
//				richMessage.setTitle(title);
//				richMessage.setContent(content);
//				richMessage.setUrl(imageUri);
//				richMessage.setPushContent(title);
//				Message message = sendMessage(toUserId, richMessage, callbackContext);
//				JSONObject json = null;
//    try {
//        json = message2Json(message);
//        callbackContext.success(json);
//				} catch (Throwable e) {
//                    callbackContext.error(json);
//                }
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