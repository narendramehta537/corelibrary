export class Constants {
    static NO_HEADER = 'noHeader';
    static BUTTON = 'button';
    static TEMPLATE = 'template';
    static IMAGE_FORMATS = '.jpg, .jpeg, .png';
    static IMAGEFORMATS = ['jpg', 'png', 'jpeg'];
    static VIDEOFORMATS = ['avi', 'mov', 'ogg', 'wmv', 'webm'];
    static AUDIOFORMATS = ['mp3', 'wav'];
    static ALL_FORMATS = '.*';
    static NA = 'n/a';

    static GET = 'GET';
    static PUT = 'PUT';
    static POST = 'POST';
    static PATCH = 'PATCH';
    static DELETE = 'DELETE';

    static isBody(method) {
        return (method == this.PUT || method == this.POST || method == this.PATCH);
    }

}