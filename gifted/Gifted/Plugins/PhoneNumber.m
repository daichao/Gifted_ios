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

- (void)getSimCountryIso:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    CDVPluginResult* pluginResult = nil;
    @try {
        NSLocale *currentLocale = [NSLocale currentLocale];
        NSString *code=[currentLocale objectForKey:NSLocaleCountryCode];
        NSError *error;
        NSString *SimCountryIso;
        if(code!=nil)
        {
           //[SimCountryIso:AS]JSON格式数据
        
//          NSString *jsonString = @"{\"ID\":{\"Content\":268,\"type\":\"text\"},\"ContractTemplateID\":{\"Content\":65,\"type\":\"text\"}}";
            NSString *jsonString=[NSString stringWithFormat:@"{\"SimCountryIso\":\"%@\"}",code];
            NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
            id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            NSLog(@"%@",[json objectForKey:@"SimCountryIso"]);
            SimCountryIso=json;
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:SimCountryIso];
        }else
        {
            NSLog(@"%@ - %@", @"Get CountryCode Error", [error localizedDescription]);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during Get CountryCode"];
        }

        [self writeJavascript:[pluginResult toSuccessCallbackString:[arguments objectAtIndex:0]]]; // callbackId
    } @catch(NSException* exception) {
        NSLog(@"%@ - %@", @"Get CountryCode Error", [exception debugDescription]);
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during Get CountryCode"];
        [self writeJavascript:[pluginResult toErrorCallbackString:[arguments objectAtIndex:0]]]; // callbackId
    }
}

- (void)getPhoneNumber:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
}

@end