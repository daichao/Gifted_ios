//
//  MessageQueue.m
//  Gifted
//
//  Created by daichao on 15/3/14.
//
//

#import <Foundation/Foundation.h>
#import "MessageQueue.h"
#import "RCMessage.h"
#import "MessageUtil.h"


@implementation MessageQueue
@synthesize message;

//@synthesize  message;
//@synthesize messageQueue;//nsmutablearray是可变的数组

static NSMutableArray *messageQueue;

//添加消息
+(void)addMessage:(RCMessage*)message{
    if (messageQueue==nil||messageQueue==NULL){
        messageQueue=[[NSMutableArray alloc]init];
        [messageQueue addObject:message];
    }
    else{
        [messageQueue addObject:message];
    }
}

//获取并移除消息
+(RCMessage*)consumeMessage{
    RCMessage *message=[[RCMessage alloc]init];
    if(messageQueue!=nil&&[messageQueue count]>0){
       message= [messageQueue objectAtIndex:0];
        [messageQueue removeObjectAtIndex:0];
    }
    else{
        message=nil;
    }
    return message;
    
}
////使用前端并不移除消息
+(RCMessage*)peekMessage{
//    [messageQueue ]
    RCMessage *message=[[RCMessage alloc]init];
    if([messageQueue count]>0){
        message=[messageQueue objectAtIndex:0];
    }
    return message;
}

@end