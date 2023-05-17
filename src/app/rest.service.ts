import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  findAll(collectionName: string) {
    const url = environment.production === true ? environment.baseURL + collectionName + "/_all_docs?include_docs=true&attachments=true" : collectionName + "/_all_docs?include_docs=true&attachments=true";
    const httpRequest = this.http.get(url);
    return this.promiseMethod(httpRequest);
  }

  findOne(collectionName: string, id: string) {
    const url = environment.production === true ?  environment.baseURL + collectionName + "/" : collectionName + "/" + id;
    const httpRequest = this.http.get(url);
    return this.promiseMethod(httpRequest);
  }


  findByCriteria(collectionName: string, criteria: any) {
    const url = environment.production === true ?  environment.baseURL + collectionName + "/_find" : collectionName + "/_find";
    const httpRequest = this.http.post(url, criteria);
    return this.promiseMethod(httpRequest);
  }

  save(collectionName: string, data: any) {
    const url = environment.production === true ?  environment.baseURL + collectionName : collectionName;
    const httpRequest = this.http.post(url, data);
    return this.promiseMethod(httpRequest);
  }

  deleteOne(collectionName: string, id: string, rev: string) {
    const url = environment.production === true ?  environment.baseURL + collectionName + "/" + id + "?rev=" + rev : collectionName + "/" + id + "?rev=" + rev;
    const httpRequest = this.http.delete(url);
    return this.promiseMethod(httpRequest);
  }

  updateOne(collectionName: string, id: string, data: any) {
    const url = environment.production === true ?  environment.baseURL + collectionName + "/" + id : collectionName + "/" + id; 
    const httpRequest = this.http.put(url, data);
    return this.promiseMethod(httpRequest);
  }


  updateImg(collectionName: string, data: any) {
    // console.log(data);
    const url = environment.production === true ?  environment.baseURL + collectionName + "/" + data._id + "/image?rev=" + data._rev : collectionName + "/" + data._id + "/image?rev=" + data._rev;;
    const httpRequest = this.http.put(url, data.image);
    return this.promiseMethod(httpRequest);
  }


  response(status: string, message: string, records: []) {
    let responseData = {
      status: status,
      message: message,
      records: records
    }
    return responseData;
  }

  promiseMethod(httpRequest: any) {
    const promise = new Promise(resolve => {
      httpRequest.toPromise().then((res: any) => {
        // console.log(res);
        resolve(this.response("success", '', res));
      }).catch((err: { message: string; }) => {
        resolve(this.response("failed", err.message, []));
      });
    })
    return promise;
  }

}
