//
//  MessageUtil.h
//  Gifted
//
//  Created by daichao on 15/3/10.
//
//

#import <Cordova/CDV.h>

@interface MessageUtil : CDVPlugin


@property (copy)   NSString* callbackId;

- (void)connectIMServer:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (void)clearUnreadCount:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (void)getConversationList:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (void)consumeMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (void)sendTextMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (void)loadHistory:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
