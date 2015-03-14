//
//  MessageQueue.m
//  Gifted
//
//  Created by daichao on 15/3/14.
//
//

#import <Foundation/Foundation.h>
#import "MessageQueue.h"

@implementation MessageQueue

//@synthesize  message;
//@synthesize messageQueue;//nsmutablearray是可变的数组

static NSMutableArray *messageQueue;

//添加消息
+(void)addMessage:(RCMessage*)message{
    [messageQueue addObject:message];
    
    }

//返回最新的消息
+(RCMessage*)consumeMessage{
//    [messageQueue ]
//    [messageQueue removeLastObject];
}
//返回所有消息
+(NSArray*)peekMessage{
//    [messageQueue ]
}

@end