import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageDetails, PostDetails, QueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent, ICardTemplate } from 'src/app/shared/components/card/card.component';
import { environment } from 'src/environments/environment';
import * as data from './pin.data.json';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {

  @ViewChild('search') searchElement: ElementRef;
  searchText: string = '/ArtStation_HQ/digital-2d-art';// 'serbanlorena';
  dataSource: CardComponent[] = [];
  userDetails: any;
  authService: any;
  currentPageSource: any;
  currentPageDetails: PageDetails;
  postDetails: PostDetails[] = [];
  havePosts = false;

  constructor(private utilService: UtilsService) {

  }

  ngOnInit(): void {
    let pinData: any = data;
    // let tempData = this.utilService.getBetween(pinData.default, 'application/json">{"rebuildStoreOnClient', '</script>');
    // this.userDetails = JSON.parse('{"rebuildStoreOnClient' + tempData[0]);
    // this.parseFirstPage(this.userDetails);
    // this.parsePosts(pinData.default.resource_response);
  }

  searchUser(e) {

    let queryModel = new QueryModel({ Url: `https://in.pinterest.com/${this.searchText}` });

    this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel)
      .subscribe((res: any) => {
        let data = this.utilService.getBetween(res.data, 'application/json">{"rebuildStoreOnClient', '</script>');
        this.userDetails = JSON.parse('{"rebuildStoreOnClient' + data[0]);
        this.parsePosts(this.userDetails.resourceResponses[1]?.response, this.userDetails.resourceResponses[1]?.options);
      })
  }

  parsePosts(response, options?) {
    this.currentPageSource = response;

    let currentPostDetails = [];
    this.currentPageDetails = {
      cursor: response.bookmark,
      pageNumber: this.currentPageDetails?.pageNumber || 25,
      cursorData: this.currentPageDetails?.cursorData
    };
    options && (this.currentPageDetails.cursorData = { options: options });
    // this.currentPageDetails.cursorData && (this.currentPageDetails.cursorData.bookmarks = [response?.bookmark]);

    response.data?.map((post) => {
      let captions = [post.closeup_unified_description || post.description];
      let displayUrls = [];
      post?.images?.orig?.url && displayUrls.push(post.images.orig.url);
      currentPostDetails.push({
        id: post.id,
        comments: post.comment_count,
        likes: post.favorite_user_count,
        captions: captions,
        displayUrls: displayUrls
      });
    });

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
      this.dataSource.push(card);
    })

    this.havePosts = currentPostDetails.length >= 25;
  }


  nextPage() {

    if (this.currentPageDetails?.cursor) {
      this.currentPageDetails.pageNumber += 25;
      let url = `https://in.pinterest.com/resource/BoardFeedResource/get/?source_url=${encodeURIComponent(this.searchText)}&data=${encodeURIComponent(JSON.stringify(this.currentPageDetails.cursorData))}&_=${new Date().getTime()}`;

      let queryModel = new QueryModel({ Url: url });
      this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel)
        .subscribe((res: any) => {
          let parsed = JSON.parse(res.data);
          this.parsePosts(parsed?.resource_response, parsed?.resource.options);
        }, error => {
          this.currentPageDetails.cursor = null;
        });
    }

  }

}
