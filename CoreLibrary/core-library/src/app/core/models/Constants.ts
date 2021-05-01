export class Constants {
    static NO_HEADER = 'noHeader';
    static BUTTON = 'button';
    static TEMPLATE = 'template';
    static IMAGE_FORMATS = '.jpg, .jpeg, .png'

    static GET = 'GET';
    static PUT = 'PUT';
    static POST = 'POST';
    static PATCH = 'PATCH';
    static DELETE = 'DELETE';

    static isBody(method) {
        return (method == this.PUT || method == this.POST || method == this.PATCH);
    }
}