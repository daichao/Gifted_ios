//
//  MessageQueue.h
//  Gifted
//
//  Created by daichao on 15/3/14.
//
//

#import "RCIMClient.h"
#import "RCMessage.h"
#import "RCMessageContent.h"
#import <Foundation/Foundation.h>

@interface  MessageQueue : NSObject{
    
}
//-(RCMessage *)message;
//-(NSMutableArray *)messageQueue;

//添加消息
+(void)addMessage:(RCMessage*)message;

//返回第一个元素，并在队列中删除
+(RCMessage*)consumeMessage;

//返回第一个元素
+(NSArray*)peekMessage;


/*
 模仿android版应用增加MessageQueue
 用于消息的存取
 */
//private static Queue<Message> messageQueue = new LinkedList<Message>();
//
//public static boolean addMessage(Message message){
//    return messageQueue.offer(message);
//}
//
//public static Message consumeMessage(){
//    return messageQueue.poll();
//}
//
//public static Message peekMessage(){
//    return messageQueue.peek();
//}
@end

