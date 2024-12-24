import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true,
})
export class FadeInDirective implements AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Applique initialement l'opacité à 0 pour commencer avec un élément invisible
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.9s ease-in-out');

    // Attendre que l'élément soit rendu avant d'appliquer l'animation
    setTimeout(() => {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    }, 50); // Légère pause pour garantir le déclenchement de l'animation
  }
}
