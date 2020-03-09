import imageCacheHoc from 'react-native-image-cache-hoc';
import { Image } from 'react-native-elements';

export default CacheableImage = imageCacheHoc(Image, {
    fileHostWhitelist: ['firebasestorage.googleapis.com'],
    fileDirName: 'OutImageCacheHoc'
  });

