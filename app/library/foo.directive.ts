import {Directive, ElementRef, Inject, Input} from 'angular2/core';
@Directive({
    selector: '[myHighlight]'
})
export class Foo {
    constructor(@Inject(ElementRef) el: ElementRef) {
       el.nativeElement.style.backgroundColor = 'yellow';
    }
}
