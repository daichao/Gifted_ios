//
//  MessageQueue.h
//  Gifted
//
//  Created by daichao on 15/3/14.
//
//

#import "RCIMClient.h"
#import "RCMessage.h"
#import <Foundation/Foundation.h>

@interface  MessageQueue : NSObject{
    
}

@property(nonatomic,strong) RCMessage *message;
//添加消息
+(void)addMessage:(RCMessage*)message;

//返回第一个元素，并在队列中删除
+(RCMessage*)consumeMessage;

//返回第一个元素
+(RCMessage*)peekMessage;

@end

