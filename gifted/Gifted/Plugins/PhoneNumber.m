//
//  PhoneNumber.m
//  Gifted
//
//  Created by daichao on 15/3/5.
//
//

#import <Foundation/Foundation.h>

#import "PhoneNumber.h"
#import <Cordova/CDV.h>

@implementation PhoneNumber

//获取国家区号
- (void)getSimCountryIso:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult* pluginResult = nil;
    @try {
        NSLocale *currentLocale = [NSLocale currentLocale];
        NSString *code=[currentLocale objectForKey:NSLocaleCountryCode];
        NSError *error;
        NSString *SimCountryIso;
        if(code!=nil)
        {
            NSString *jsonString=[NSString stringWithFormat:@"{\"SimCountryIso\":\"%@\"}",code];
            NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
            id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            NSLog(@"%@",[json objectForKey:@"SimCountryIso"]);
            SimCountryIso=[json valueForKey:@"SimCountryIso"];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:json];
            [self writeJavascript:[pluginResult toSuccessCallbackString:[arguments objectAtIndex:0]]]; // callbackId
        }else
        {
            NSLog(@"%@ - %@", @"Get CountryCode Error", [error localizedDescription]);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during Get CountryCode"];
        }
        
    } @catch(NSException* exception) {
        NSLog(@"%@ - %@", @"Get CountryCode Error", [exception debugDescription]);
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during Get CountryCode"];
        [self writeJavascript:[pluginResult toErrorCallbackString:[arguments objectAtIndex:0]]]; // callbackId
    }
}
//由于私有的api无法通过appstore审核，所以这边方法只返回空的字符串
- (void)getPhoneNumber:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult *result=nil;
    result=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
    [self writeJavascript:[result toSuccessCallbackString:[arguments objectAtIndex:0]]];
}

@end