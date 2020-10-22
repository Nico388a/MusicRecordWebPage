import Axios from "../../node_modules/axios/index";
import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"

let baseUrl = "https://pairprojectmusicrecordsrest20201020113611.azurewebsites.net/api/MusicRecords"

interface IRecord{
    title:string,
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
        record: {},
        records: []
    },
    methods: {
        getAll(){
            getAll(baseUrl, resp=> {
                this.records = resp.data;    
            });
        },
        search(){
            let record:IRecord = this.record;
            let url = baseUrl + "/search?";

            if(record.title != undefined)
                url = url + "&Title=" + record.title;
            if(record.artist != undefined)
                url = url + "&Artist=" + record.artist;
            if(record.duration > 0)
                url = url + "&MaxDuration=" + record.duration;
            if(record.yearOfPublication > 0)
                url = url + "&YearOfPublication=" + record.yearOfPublication;

            console.log(url);
            getAll(url, resp => this.records = resp.data);
        }
    }
});

vue.getAll();


function getAll(url:string, onSuccess:(resp:AxiosResponse<any>)=>void) {
    handlePromise(axios.get<IRecord[]>(url), onSuccess);
}

function get(url:string, onSuccess:(resp:AxiosResponse<any>)=>void) {
    
}

function handlePromise(promise:Promise<any>, onSuccess:(resp:AxiosResponse<any>)=>void) {
    promise.then((response:AxiosResponse<any>) => {
        onSuccess(response);
    })
    .catch((error:AxiosError)=>{
        alert(error.message);
    });
}