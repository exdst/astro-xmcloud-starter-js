class AstroAnimatedSection extends HTMLElement {
  connectedCallback() {
    const isEditing = this.dataset.editing === 'true';
    const animationType = this.dataset.animationType || 'slide';

    if (isEditing) {
      if (animationType === 'slide') {
        this.style.opacity = '1';
      }
      return;
    }

    // Respect prefers-reduced-motion: show final state immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (animationType === 'slide') {
        this.style.opacity = '1';
      } else if (animationType === 'rotate') {
        const endRotation = this.dataset.endRotation || '180';
        this.style.transform = `rotate(${endRotation}deg)`;
      }
      return;
    }

    const delay = parseInt(this.dataset.delay || '0', 10);
    const duration = parseInt(this.dataset.duration || '1000', 10);

    if (animationType === 'rotate') {
      const endRotation = this.dataset.endRotation || '180';
      this.style.transition = `transform ${duration}ms ease-in-out ${delay}ms`;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.style.transform = `rotate(${endRotation}deg)`;
              observer.unobserve(this);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(this);
    } else {
      // slide animation
      const direction = this.dataset.direction || 'up';
      const translations: Record<string, { x: string; y: string }> = {
        up: { x: '0', y: '2rem' },
        down: { x: '0', y: '-2rem' },
        left: { x: '2rem', y: '0' },
        right: { x: '-2rem', y: '0' },
      };

      const { x, y } = translations[direction] || translations.up;
      this.style.display = 'block';
      this.style.transform = `translate(${x}, ${y})`;
      this.style.opacity = '0';
      this.style.transition = `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.style.transform = 'translate(0, 0)';
              this.style.opacity = '1';
              observer.unobserve(this);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(this);
    }
  }
}

customElements.define('astro-animated-section', AstroAnimatedSection);
