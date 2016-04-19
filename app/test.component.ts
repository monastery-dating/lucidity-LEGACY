import { Component, Inject } from 'angular2/core'

@Component({
  selector: 'le-test',
  //directives: [Dragula],
  //viewProviders: [DragulaService],
  template:`
  <div>
    <div class='wrapper'>
      <div class='container' [dragula]='"first-bag"'>
        <div>You can move these elements between these two containers</div>
        <div>Moving them anywhere else isn't quite possible</div>
        <div>There's also the possibility of moving elements around in the same container, changing their position</div>
      </div>
      <div class='container' [dragula]='"first-bag"'>
        <div>This is the default use case. You only need to specify the containers you want to use</div>
        <div>More interactive use cases lie ahead</div>
        <div>Make sure to check out the <a href='https://github.com/bevacqua/dragula#readme'>documentation on GitHub!</a></div>
      </div>
    </div>
  </div>
  `
})
export class TestComponent {

/*
  constructor(@Inject (DragulaService) private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
  }
  */
}
