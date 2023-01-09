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
  lgth: number = 0;
  token: string = '';
  recaptchatoken: string|undefined;
  endpoint: string = 'https://ytdl-jf2qqsfolq-uc.a.run.app/download/';
  // endpoint: string = 'http://localhost:8080/download/';
  

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
    });
  }

  onSubmit() {
    this.url = '';
    this.token = '';
    this.title = 'Please verify you are a human by completing the CAPTCHA...';
    const jsonBody = this.ytdlForm.value;
    if (jsonBody['ytaddress'] !== ''){
      let regex = new RegExp('[a-zA-Z0-9-?_?]{10,12}')
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
        console.log('token: ' + this.token);
        this.submit_clicked = true;
      }
    } else {
      this.title = 'Error: Input not accepted. Please enter valid YouTube video URL.';
      this.initializeForms();
    }
  }

  public send(form: NgForm): void {
    this.title = 'Please wait...';
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }
    // console.debug(`Token [${this.recaptchatoken}] generated`);
    const requesturi = this.endpoint + this.vcode + '/' + this.recaptchatoken;
    this.requestbuilderService.getSubmit(requesturi).subscribe(response => {
      console.log(response)
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
      // this.initializeForms();
    });
  }
}


