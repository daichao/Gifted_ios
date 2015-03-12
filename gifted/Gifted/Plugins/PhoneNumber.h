//
//  PhoneNumber.h
//  Gifted
//
//  Created by daichao on 15/3/5.
//
//

/*
 *获取当前国家区号
 */
#import <Cordova/CDV.h>


@interface PhoneNumber : CDVPlugin

- (void)getSimCountryIso:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (void)getPhoneNumber:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;


@end