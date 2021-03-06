import { TemplateRef } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormTemplate, Operation } from 'src/app/core/models/components/Form';
import { IAjaxSettings } from 'src/app/core/models/components/Table';
import { PageDetails, PostDetails, QueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent, ICardTemplate } from 'src/app/shared/components/card/card.component';
import { environment } from 'src/environments/environment';
import * as data from './insta.data.json';

@Component({
  selector: 'app-insta',
  templateUrl: './insta.component.html',
  styleUrls: ['./insta.component.scss']
})
export class InstaComponent implements OnInit {

  @ViewChild('search') searchElement: ElementRef;
  searchText: string = 'liquidverve';// 'serbanlorena';
  instaDataSource: CardComponent[] = [];
  havePosts = false;

  @ViewChild(TemplateRef) customCard: TemplateRef<any>;

  formData = {
    client_id: '1215772298875241',
    client_secret: 'f62aaa040fc0aa5d3e8dea2830988eec',
    redirect_uri: 'https://localhost:4200/oauth',
    responseType: 'code',
    state: '1',
    scope: 'user_profile,user_media'
  }
  formTemplate: any;
  userDetails: any;
  authService: any;
  currentPageSource: any;
  currentPageDetails: PageDetails;
  postDetails: PostDetails[] = [];

  constructor(private utilService: UtilsService) {

  }

  ngAfterViewInit() {
    this.searchElement?.nativeElement && fromEvent(this.searchElement.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      // , filter(res => res.length > 2)

      // Time in milliseconds between key events
      , debounceTime(400)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      this.searchText = text;
    });

    // let instaData: any = data;
    // this.parsePostDetails(instaData.default.data.user);
  }

  ngOnInit(): void {

  }

  searchUser(e) {

    let queryModel = new QueryModel({ Url: `https://www.instagram.com/${this.searchText}` });

    this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel)
      .subscribe((res: any) => {
        let data = this.utilService.getBetween(res.data, 'window._sharedData =', ';</script>');
        this.userDetails = JSON.parse(data[0]).entry_data.ProfilePage[0].graphql.user;
        this.parsePostDetails(this.userDetails);
      })
  }

  parsePostDetails(pageDetails) {
    let currentPostDetails = [];
    this.currentPageSource = pageDetails;
    this.currentPageDetails = {
      cursor: pageDetails.edge_owner_to_timeline_media.page_info.end_cursor,
      postNumber: this.currentPageDetails?.postNumber || 12
    }
    pageDetails.edge_owner_to_timeline_media?.edges?.map((post) => {
      let node = post.node;
      let captions = [];
      node.edge_media_to_caption?.edges?.map((caption) => {
        caption?.node?.text && captions.push(caption.node.text);
      });
      let displayUrls = [];
      node.thumbnail_src && displayUrls.push(node.thumbnail_src);
      node.edge_sidecar_to_children?.edges?.map((du) => {
        du.node?.display_url && displayUrls.push(du.node.display_url);
        du.node?.video_url && displayUrls.push(du.node.video_url);
      })

      currentPostDetails.push({
        id: node.id,
        comments: node.edge_media_to_comment?.count,
        likes: node.edge_liked_by?.count,
        captions: captions,
        displayUrls: displayUrls
      });
    })

    this.postDetails.push(...currentPostDetails);

    currentPostDetails.forEach((post: PostDetails) => {
      let card = new CardComponent(this.utilService);

      let cardTemplates = post.displayUrls.map((childPost, index): ICardTemplate => {
        return {
          media: { src: childPost, type: childPost.includes('.mp4') ? 'Video' : 'Image' },
          text: post.captions[0],
          title: ' '
        }
      });
      card.setCards(cardTemplates);
      this.instaDataSource.push(card);
    })

    this.havePosts = currentPostDetails.length >= 50 || (this.currentPageDetails.postNumber == 12 && currentPostDetails.length == 12);

  }

  nextPage() {

    if (this.currentPageDetails?.cursor) {
      this.currentPageDetails.postNumber += 50;
      let variables = encodeURIComponent(`{"id":"${this.userDetails.id}","first":${this.currentPageDetails.postNumber},"after":"${this.currentPageDetails.cursor}"}`);
      let url = `https://www.instagram.com/graphql/query/?query_hash=8c2a529969ee035a5063f2fc8602a0fd&variables=${variables}`;
      // let formData = {
      //   query_hash: '8c2a529969ee035a5063f2fc8602a0fd',
      //   variables: {
      //     id: this.userDetails.id,
      //     first: this.currentPageDetails.pageNumber,
      //     after: this.currentPageDetails.cursor
      //   }
      // };
      // let queryModel = new QueryModel({ Url: 'https://www.instagram.com/graphql/query', Form: formData, RequestType: 'POSTFORM' });
      let queryModel = new QueryModel({ Url: url });
      this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel)
        .subscribe((res: any) => {
          let parsed = JSON.parse(res.data);
          this.parsePostDetails(parsed?.data?.user);
        }, error => {
          this.currentPageDetails.cursor = null;
        });
    }

  }


  cancel() {
    // this.location.back();
  }


  instaForm() {
    this.formTemplate = new FormTemplate({
      updateUrl: 'url',

      onBeforeSend: (operation: string, ajaxSettings: IAjaxSettings) => {
        this.formTemplate.validationErrors = [];
        let formValue = this.formTemplate.formGroup.value;
        // formValue['email'] = this.authService.tokenDetails.userData.userName;
        ajaxSettings.data = formValue;
        formValue['ts'] = new Date().getTime();
        localStorage.setItem('secureData', JSON.stringify(formValue));
        this.formData = formValue;
        location.href = `https://api.instagram.com/oauth/authorize?client_id=${this.formData.client_id}&redirect_uri=${this.formData.redirect_uri}&scope=${this.formData.scope}&response_type=${this.formData.responseType}`;
      },
      onFormLoading: () => {
      },
      errorHandler: (response) => {
        // if (response.status === 422) {
        //   this.formTemplate.validationErrors.push(response.error);
        // } else if (response.status === 403) {
        //   this.formTemplate.validationErrors.push({ header: '', errors: [response.error || "Authorization failed."] });
        // }
        // else if (response.status === 400) {
        //   this.formTemplate.validationErrors.push({ header: '', errors: ["Unable to change password."] });
        // }
        // else {
        //   this.formTemplate.validationErrors.push({ header: '', errors: ["Authorization failed."] });
        // }
      },
      onUpdating: (k, value) => {
        // this.toastService.showSuccess("Password changed!", '');
        // this.router.navigate(['/dashboard']);
      }
    }, {
      operation: Operation.Edit,
      submitText: 'Confirm',
      hideOperation: true,
      addRow: true,
      defaultOperations: true,
      showView: false
    });
    this.formTemplate.submitButtonClass += 'd-flex align-items-sm-center';
  }

  userPosts() {
    // let url =`https://graph.instagram.com/v11.0/growwithlinde?fields=id,username&access_token=${this.authService.getInstaToken()}`;
    let url = `https://graph.facebook.com/v11.0/${this.userDetails.userId}/media?access_token=${this.authService.getInstaToken()}`;
    let queryModel = new QueryModel({ Url: url });

    this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel).subscribe((res) => {
      console.log(res);
    }, error => {
      alert(error.error.displayError);
    });
  }
}

