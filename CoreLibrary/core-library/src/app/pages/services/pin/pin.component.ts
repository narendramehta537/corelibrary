import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageDetails, PostDetails, QueryModel } from 'src/app/core/models/QueryModels';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CardComponent, ICardTemplate } from 'src/app/shared/components/card/card.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {

  @ViewChild('search') searchElement: ElementRef;
  searchText: string = 'liquidverve';// 'serbanlorena';
  instaDataSource: CardComponent[] = [];
  userDetails: any;
  authService: any;
  currentPageSource: any;
  currentPageDetails: PageDetails;
  postDetails: PostDetails[] = [];

  constructor(private utilService: UtilsService) {

  }

  ngOnInit(): void {
  }
  searchUser(e) {

    let queryModel = new QueryModel({ Url: `https://in.pinterest.com/${this.searchText}` });

    this.utilService.postRequestUnHandled(environment.apiEndPoint.insta.httpRequest, queryModel)
      .subscribe((res: any) => {
        debugger;
        let data = this.utilService.getBetween(res.data, 'application/json">{"rebuildStoreOnClient', '</script>');
        this.userDetails = JSON.parse(data[0]);
        this.parseFirstaPage(this.userDetails);
      })
  }

  parseFirstaPage(pageDetails) {
    let currentPostDetails = [];
    this.currentPageSource = pageDetails;
    pageDetails.resourceResponses[1]?.response?.data?.map((node) => {
      let captions = [];
      captions.push(node.closeup_unified_description);
      let displayUrls = [];
      node?.images?.orig?.url && displayUrls.push(node.images.orig.url);
      currentPostDetails.push({
        id: node.id,
        // comments: node.edge_media_to_comment?.count,
        // likes: node.edge_liked_by?.count,
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
      this.instaDataSource.push(card);
    })

  }

  parsePostDetails(pageDetails) {
    let currentPostDetails = [];
    this.currentPageSource = pageDetails;
    this.currentPageDetails = {
      cursor: pageDetails.edge_owner_to_timeline_media.page_info.end_cursor,
      pageNumber: this.currentPageDetails?.pageNumber || 12
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

  }

  nextPage() {

    if (this.currentPageDetails?.cursor) {
      this.currentPageDetails.pageNumber += 50;
      let variables = encodeURIComponent(`{"id":"${this.userDetails.id}","first":${this.currentPageDetails.pageNumber},"after":"${this.currentPageDetails.cursor}"}`);
      let url = `https://www.instagram.com/graphql/query/?query_hash=8c2a529969ee035a5063f2fc8602a0fd&variables=${variables}`;

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

}
