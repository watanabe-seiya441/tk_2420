export interface Video {
    id: string;
    title: string;
    video_url: string;
    overlay_url: string;
    original_video_width: number;
    original_video_height: number;
}


export interface BoundingBox {
    x: number; // 左上のX座標
    y: number; // 左上のY座標
    width: number;
    height: number;
    label: string;
    color: string;
}



export interface YOLOAnnotation {
    class_id: number;
    x_center: number;
    y_center: number;
    width: number;
    height: number;
}
