import { env } from "../../env";

export class FileService {
    private baseURL = env.REACT_APP_ENDPOINT;

    public getUrlFile(contextMedia: string, media: string): string {
        let url = "";
        console.log(this.baseURL);
        if(contextMedia && media) {
            url = this.baseURL+"//filedownload?ContextMedia@="+contextMedia+"@@Media@="+media;    
        }
        return url;
    }

    /* "http://190.146.64.16:81/dcca/filedownload?ContextMedia@=temp@@Media@=2021-12-09_110648_1339022546.pdf" */
}