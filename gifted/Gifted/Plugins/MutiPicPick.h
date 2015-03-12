//
//  ImagePicker.h
//  Gifted
//
//  Created by daichao on 15/3/9.
//
//

/*
 选择多张图片
 */
#import <Cordova/CDV.h>
#import "ELCAlbumPickerController.h"
#import "ELCImagePickerController.h"

@interface MutiPicPick : CDVPlugin

@property (copy)   NSString* callbackId;

- (void)pickMutiPic:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (UIImage*)imageByScalingNotCroppingForSize:(UIImage*)anImage toSize:(CGSize)frameSize;

@property (nonatomic, assign) NSInteger width;
@property (nonatomic, assign) NSInteger height;
@property (nonatomic, assign) NSInteger quality;



@end
