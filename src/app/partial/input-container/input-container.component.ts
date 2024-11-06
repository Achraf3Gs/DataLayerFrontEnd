import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-container',
  templateUrl: './input-container.component.html',
  styleUrls: ['./input-container.component.css'],
  standalone: true,
   imports:[NgStyle],
})
export class InputContainerComponent implements OnInit {
  @Input() label!: string;
  @Input() bgColor: string = 'white';

  constructor() {}

  ngOnInit(): void {}
}
