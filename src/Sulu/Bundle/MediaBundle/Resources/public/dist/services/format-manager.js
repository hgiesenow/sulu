define(["services/husky/util"],function(a){"use strict";var b={formats:"/admin/api/media/%i/formats?locale=%s",format:"/admin/api/media/%i/formats/%s?locale=%s"};return{loadFormats:function(c,d){return a.load(a.sprintf(b.formats,c,d))},saveFormat:function(c,d,e){return a.save(a.sprintf(b.format,c,e.key,d),"PUT",e)},cropPossibleInInFormat:function(a,b,c,d){return!a&&!b||a&&a>c||b&&b>d?!1:!0},cropOptionsAreValid:function(a,b,c,d,e){return a.cropX<0||a.cropY<0||a.cropWidth<0||a.cropHeight<0?!1:a.cropX+a.cropWidth>d||a.cropY+a.cropHeight>e?!1:b&&a.cropWidth<b||c&&a.cropHeight<c?!1:b&&c?Math.abs(a.cropWidth/a.cropHeight-b/c)<1:!0}}});