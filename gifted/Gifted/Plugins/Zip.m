//
//  Zip.m
//  Gifted
//
//  Created by daichao on 15/2/27.
//
//

#import "Zip.h"
#import "ZipArchive.h"
#import <Cordova/CDV.h>

@implementation Zip

-(void)zip:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    CDVPluginResult* pluginResult = nil;
    NSArray *filePaths = [arguments objectAtIndex:1];//多个文件的路径列表
    NSArray *fileKeys = [arguments objectAtIndex:2];//fileKeys
    NSString *tmpPath= NSTemporaryDirectory();
    NSString *zipFile=[tmpPath stringByAppendingString:@"gifted.zip.tmp"];
    NSString *path =nil;
    NSError *error;
    @try {
            //压缩文件
            ZipArchive *za = [[ZipArchive alloc] init];
            BOOL ret=[za CreateZipFile2:zipFile];
            for(int i=0;i<[filePaths count];i++)
            {
                path=filePaths[i];
                path=[path stringByReplacingOccurrencesOfString:@"file://" withString:@"/private"];
//                NSRange range = [path rangeOfString:@"tmp/"]; //现获取要截取的字符串位置
//                NSString *tmpImgPath = [path substringFromIndex:range.location]; //截取字符串
//                NSString *imgPath = [tmpImgPath substringFromIndex:4];
//                ret=[za addFileToZip:zipFile newname:imgPath];
                ret=[za addFileToZip:path newname:fileKeys[i]];
            }
            if(ret==YES){
                NSLog(@"%@", [@"Success for zipfile:" stringByAppendingString:zipFile]);
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:zipFile];
            }else {
                NSLog(@"%@ - %@", @"Error occurred during zipping", [error localizedDescription]);
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during unzipping"];
            }
            if (![za CloseZipFile2]) {
                zipFile=@"";
            }
            [za release];
            [self writeJavascript:[pluginResult toSuccessCallbackString:[arguments objectAtIndex:0]]]; // callbackId
    } @catch(NSException* exception) {
            NSLog(@"%@ - %@", @"Error occurred during unzipping", [exception debugDescription]);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during unzipping"];
            [self writeJavascript:[pluginResult toErrorCallbackString:[arguments objectAtIndex:0]]]; // callbackId
    }
}

@end