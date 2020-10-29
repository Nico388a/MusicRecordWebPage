import Axios from "../../node_modules/axios/index";
import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index"

let baseUrl = "https://pairprojectmusicrecordsrest20201020113611.azurewebsites.net/api/MusicRecords"

interface IRecord {
    title: string,
    artist: string,
    duration: number,
    yearOfPublication: number,
    id: number
}

let vue = new Vue({
    // TypeScript compiler complains about Vue because the CDN link to Vue is in the html file.
    // Before the application runs this TypeScript file will be compiled into bundle.js
    // which is included at the bottom of the html file.
    el: "#app",
    data: {
        name: "",
        greeting: "",
        record: { title: "", artist: "", duration: 0, yearOfPublication: 0, id: 0 },
        deleteRecord: {},
        records: [],
        loading: "",
        deleted: "",
        selected: undefined,
        selectedData: {},
        putRecord: {id:0}
    },
    methods: {
        getAll() {
            get(baseUrl, resp => {
                this.records = resp.data;
            });
        },
        search() {
            let record: IRecord = this.record;
            let url = baseUrl + "/search?";

            if (record.title != undefined && record.title != "")
                url = url + "&Title=" + record.title;
            if (record.artist != undefined && record.artist != "")
                url = url + "&Artist=" + record.artist;
            if (record.duration > 0)
                url = url + "&MaxDuration=" + record.duration;
            if (record.yearOfPublication > 0)
                url = url + "&YearOfPublication=" + record.yearOfPublication;

            console.log(url);
            get(url, resp => this.records = resp.data);
        },
        clear() {
            this.records = [];
        },
        post() {
            post(formatInput(this.record), resp => this.getAll());
        },
        remove() {
            let record: IRecord = this.deleteRecord;
            let url = baseUrl + "/delete?";

            if (record.title != undefined && record.title != "")
                url = url + "&Title=" + record.title;
            if (record.artist != undefined && record.artist != "")
                url = url + "&Artist=" + record.artist;

            console.log(url);
            remove(url, resp => {
                this.deleted = "Deleted items: " + resp.data;
                this.getAll();
            });
        },

        displaySelected(record: IRecord) {
            console.log(record);
            this.selected = "Selected: " + record.title + " By " + record.artist;
            this.selectedData = record;
            this.deleteRecord = record;

        },
        update() {
            if (this.selected != undefined) {
                let id: number = this.selectedData.id;
                let record: IRecord = this.putRecord;
                record = formatInput(record);

                console.log(record);
                
                put(baseUrl + "/" + id, record, resp => this.getAll());
            }
            else{
                alert("Please select something to change from the list.")
            }
        }
    }
});

vue.getAll();
vue.loading = undefined;
vue.deleted = undefined;

function get(url: string, onSuccess: (resp: AxiosResponse<any>) => void) {
    handlePromise(axios.get<IRecord[]>(url), onSuccess);
}

function post(data: IRecord, onSuccess: (resp: AxiosResponse<any>) => void) {
    handlePromise(axios.post(baseUrl, data), onSuccess);
}

function remove(url: string, onSuccess: (resp: AxiosResponse<any>) => void) {
    handlePromise(axios.delete<number>(url), onSuccess);
}

function put(url: string, data: IRecord, onSuccess: (resp: AxiosResponse<any>) => void) {
    handlePromise(axios.put(url, data), onSuccess);
}

function handlePromise(promise: Promise<any>, onSuccess: (resp: AxiosResponse<any>) => void) {
    vue.loading = "Loading..."
    promise.then((response: AxiosResponse<any>) => {
        onSuccess(response);
        vue.loading = undefined;
    })
        .catch((error: AxiosError) => {
            alert(error.message);
        });
}

function formatInput(record: any): IRecord {
    let output: IRecord = { title: record.title, artist: record.artist, duration: parseFloat(record.duration), yearOfPublication: parseFloat(record.yearOfPublication), id: parseInt(record.id) };
    return output;
}