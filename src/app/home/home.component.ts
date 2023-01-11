import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { RequestbuilderService } from '../requestbuilder.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{
  color = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  ytdlForm: FormGroup;
  waiting=false;
  prompt: string;
  submit: string;
  submit_clicked: boolean = false;
  vcode: string;
  showDialog=false;
  errorStatus: string;
  errorText: string;
  url: string = '';
  title: string = '';
  tag: string;
  uri: string;
  lgth: number = 0;
  recaptchatoken: string|undefined;
  endpoint: string = 'https://ytdl-jf2qqsfolq-uc.a.run.app/download';
  
  constructor(
    private fb: FormBuilder,
    private http2: HttpClient,
    private requestbuilderService: RequestbuilderService,
    private router: Router
) {
  this.recaptchatoken = undefined;
}

  ngOnInit(): void {
    this.initializeForms()
  }

  initializeForms(): void {
    this.ytdlForm = this.fb.group({
      ytaddress: ['', Validators.required],
      submitbutton: ['', Validators.required],
    });
  }
  
  downloadVideo(){
    this.tag='video';
  }

  downloadAudio(){
    this.tag='audio';
  }

  onSubmit() {
    this.url = '';
    this.title = 'Please verify you are a human by completing the CAPTCHA...';
    const jsonBody = this.ytdlForm.value;
    if (jsonBody['ytaddress'] !== ''){
      let regex = new RegExp('[a-zA-Z0-9-_]{11}')
      if (regex.test(jsonBody['ytaddress']) === false){
        this.title = 'Error: "' + jsonBody['ytaddress'] + '" not accepted. Please enter valid YouTube video URL.';
        return;
      }
      if (!jsonBody['ytaddress'].match('youtube\.com') && !jsonBody['ytaddress'].match('youtu\.be')){
        this.title = 'Error: "' + jsonBody['ytaddress'] + '" not accepted. Please enter valid YouTube video URL.';
        return;
      }
      if (jsonBody['ytaddress'].match(regex).length === 1){
        this.vcode = jsonBody['ytaddress'].match(regex)
        this.submit_clicked = true;
      }
    } else {
      this.title = 'Error: Input not accepted. Please enter valid YouTube video URL.';
      this.initializeForms();
    }
  }

  //recaptcha
  public send(form: NgForm): void {
    this.title = 'Please wait...';
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }
    if (this.tag === 'video'){
        // download video
        this.uri = this.endpoint + '/video/' + this.vcode + '/' + this.recaptchatoken;
    } else {
        // download audio
        this.uri = this.endpoint + '/audio/' + this.vcode + '/' + this.recaptchatoken;
    }
    this.requestbuilderService.getSubmit(this.uri).subscribe(response => {
      const jsonBody2 = response;
      if (jsonBody2['url'] !== ''){
        this.url = jsonBody2['url'];
        this.title = jsonBody2['title'];
        // this.initializeForms();
      } else {
        this.title = 'Error: Input not accepted. Please enter valid YouTube video URL.';
        // this.initializeForms();
      }
    },
    errorResponse => {
      const errorJsonBody = errorResponse;
      this.title = errorJsonBody['error'];
      this.url = '';
      // this.initializeForms();
    });
  }
}


