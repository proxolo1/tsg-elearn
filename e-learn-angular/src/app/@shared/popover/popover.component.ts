import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
@Component({
  selector: 'aul-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() buttonStyle:any;
  @Input() title:any;
  @Input() type:any;
  @Input() body:any;
  @ViewChild('panel')
  overlayPanel!: OverlayPanel;

  showPanel(event: Event) {
    this.overlayPanel.show(event);
  }
  hidePanel(){
    this.overlayPanel.hide();
  }
  onMouseDown(event:Event){
    this.overlayPanel.show(event);
  }
}
