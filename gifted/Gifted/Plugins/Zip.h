//
//  Zip.h
//  Gifted
//
//  Created by daichao on 15/2/27.
//
//

#import <Cordova/CDV.h>
//#import <Foundation/Foundation.h>
//#import <Cordova/CDVPlugin.h>
//#import "ZipArchive.h"

@interface Zip : CDVPlugin

//<ZipArchiveDelegate> {
//@private
//    CDVInvokedUrlCommand* _command;
//}

//- (void)unzip:(CDVInvokedUrlCommand*)command;
//-(void)zip:(CDVInvokedUrlCommand*)command;
//- (void)zipArchiveProgressEvent:(NSInteger)loaded total:(NSInteger)total;

- (void)zip:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
