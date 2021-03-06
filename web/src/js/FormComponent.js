/**
 * Created by Sasha on 5/14/17.
 */


import React from 'react'
import ImagePicker from "./ImagePicker";
import * as axios from "axios";
import SelectableLable from "./SelectableLable";


export default class FormComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.client = axios.create({
            baseURL: "http://localhost:3000/api/",
            responseType: 'json'
        });

    }

    dataURLtoBlob(dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }


    imageChanged(picture) {
        this.setState({picture});
    }

    submitForm() {
        let data = new FormData();
        const {title, description, price, picture} = this.state;
        data.append("title", title);
        data.append("description", description);
        data.append("price", price);
        if (picture) data.append("image", picture, "image");
        this.client.post("/check", data).then(res => {
            let data = res.data;
            console.log(data);
            this.setState({
                predictions: data.predictions,
                labels: data.labels
            })
        })
    }

    render() {
        return <div className="container">
            <div className="row">
                <div className="panel panel-default margin-top">
                    <div className="panel-body">
                        <h2 className="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4 text-center">Check product</h2>
                        <form className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                            <div className="form-group">
                                <label for="exampleInputEmail1">Product title</label>
                                <input type="text" className="form-control"
                                       onChange={data => this.setState({title: data.target.value})}
                                       id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter title"/>
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Product description</label>
                                <input type="email" className="form-control"
                                       onChange={data => this.setState({description: data.target.value})}
                                       id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter description"/>
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Price</label>

                                <input type="email" className="form-control"
                                       onChange={data => this.setState({price: data.target.value})}
                                       id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter price"/>
                            </div>
                            <div>
                                {this.state.labels &&
                                this.state.labels.map((item, index) => <SelectableLable key={index} text={item}/>)}
                            </div>
                            <div className="form-group text-center">
                                <ImagePicker onChanged={(image) => this.imageChanged(image)}/>
                            </div>

                            <div className="form-group text-center">
                                {this.state.predictions &&
                                this.state.predictions.map((item, index) => <div className="prediction"
                                                                                 onClick={() => this.setState({category: index})}>
                                    <div key={index}
                                         className={"label " + (this.state.category === index ? "label-success" : "label-info")}>{item.crumbs}</div>
                                </div>)}
                            </div>
                            <div className="form-group text-center">

                                <div className="btn btn-success" onClick={() => this.submitForm()}>Submit form</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>


    }

}