import Axios from "../../node_modules/axios/index";
import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"

let baseUrl = "https://pairprojectmusicrecordsrest20201020113611.azurewebsites.net/api/MusicRecords"

interface IRecord{
    Title:string,
    artist:string,
    duration:number,
    yearOfPublication:number
}

let vue = new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        name: "",
        greeting: "",
        records: []
    },
    methods: {
        getAll(){
            getAll(resp=> {
                this.records = resp.data;
                this.greeting = this.records.toString();
            });
        }
    }
});

function getAll(onSuccess:(resp:AxiosResponse<any>)=>void) {
    handlePromise(axios.get<IRecord[]>(baseUrl), onSuccess);
}

function handlePromise(promise:Promise<any>, onSuccess:(resp:AxiosResponse<any>)=>void) {
    promise.then((response:AxiosResponse<any>) => {
        onSuccess(response);
    })
    .catch((error:AxiosError)=>{
        alert(error.message);
    });
}